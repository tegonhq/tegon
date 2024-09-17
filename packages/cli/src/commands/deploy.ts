import fs from 'node:fs';
import os from 'os';
import path from 'path';
import '../utilities/axios';
import { promisify } from 'util';

import { note, log, spinner } from '@clack/prompts';
import { Command } from 'commander';
import { execa } from 'execa';

import { login } from './login';
import { ApiClient } from '../api/client';
import { commonOptions } from '../cli/common';
import { interceptAxios } from '../utilities/axios';
import {
  checkConfigFiles,
  cleanup,
  createTriggerConfigFile,
  validateAndExportConfigs,
} from '../utilities/configValidation';
import { getVersion } from '../utilities/getVersion';
import { printInitialBanner } from '../utilities/initialBanner';

const writeFile = promisify(fs.writeFile);
const mkdtemp = promisify(fs.mkdtemp);
let tmpDir: string | null = null;

export function configureDeployCommand(program: Command) {
  return commonOptions(
    program
      .command('deploy')
      .description('deploy tegon actions to tegon servers'),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async () => {
      await printInitialBanner();

      try {
        const authorization = await login(true);

        if (!authorization) {
          throw new Error(
            `You must login first. Use the \`login\` CLI command.\n\n`,
          );
        }

        interceptAxios(authorization.auth.accessToken);
        const workspaceId = authorization.auth.workspaceId;

        const apiClient = new ApiClient(authorization.auth.apiUrl);

        const { username, pat } = await apiClient.getDockerToken(); // Get Docker token from Server

        const cwd = process.cwd(); // Get the current working directory
        const configPaths = checkConfigFiles(cwd); // Check for config.json files in the current directory and subdirectories

        const validConfigs = await validateAndExportConfigs(configPaths, cwd); // Validate and export the found config files
        note(`Valid configs found: ${validConfigs.length}`);

        if (configPaths.length === 0) {
          log.error('config.json not found. Exiting...');
          process.exit(1);
        }

        // Loop through each valid config
        for (const config of validConfigs) {
          const triggerDir = path.join(path.dirname(config.path), 'trigger'); // Create a 'trigger' directory for the config

          // Create the 'trigger' directory if it doesn't exist
          if (!fs.existsSync(triggerDir)) {
            fs.mkdirSync(triggerDir, { recursive: true });
          }

          const handlerName = `handler${config.config.name.replace(/-/g, '_').replace(/ /g, '')}`;
          const triggerIndexPath = path.join(triggerDir, 'index.ts');
          const triggerIndexContent = `
            import { run } from '../index';
            import { handler } from '@tegonhq/sdk';

            export const ${handlerName} = handler('${config.config.slug}', run);
          `.trim();

          // Write the trigger index file
          fs.writeFileSync(triggerIndexPath, triggerIndexContent);
          createTriggerConfigFile(
            path.dirname(config.path),
            workspaceId,
            authorization.auth.apiUrl,
          ); // Create the trigger.config.ts file

          const packageJsonPath = path.join(
            path.dirname(config.path),
            'package.json',
          );
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8'),
          );
          const version = packageJson.version;

          const s = spinner();
          s.start(`Deploying ${config.path} (v${version})`);

          // Deploy the action using trigger.dev
          const deployProcess = execa(
            'npx',
            ['trigger.dev@beta', 'deploy', '--self-hosted', '--skip-typecheck'],
            {
              cwd: path.dirname(config.path),
            },
          );

          const outputChunks: string[] = [];
          const handleProcessOutput = (data: Buffer) => {
            s.message(
              `Deploying ${config.path} (v${version}) - ${data.toString()}`,
            );
            outputChunks.push(data.toString());
          };

          deployProcess.stderr?.on('data', handleProcessOutput);
          deployProcess.stdout?.on('data', handleProcessOutput);

          await deployProcess;

          const deployProcessOutput = outputChunks.join('\n');

          s.stop(`Deployment successful for ${config.path}`);

          const dockerSpinner = spinner();
          dockerSpinner.start('Pushing image to docker ...');

          // Extract the version from the deployment output
          const versionRegex = /(\d{8}\.\d+)\s+/;
          const versionMatch = deployProcessOutput.match(versionRegex);
          const imageVersion = versionMatch ? versionMatch[1] : null;

          // If the image version is not found, log an error and exit the process
          if (!imageVersion) {
            console.error('Failed to extract version from deployment output');
            process.exit(1);
          }

          // Create a temporary directory and write the Docker configuration file with the provided credentials
          tmpDir = await ensureLoggedIntoDockerRegistry(
            'https://index.docker.io/v1/',
            {
              username,
              password: pat,
            },
          );

          // Run the `docker push` command to push the Docker image to the registry
          const dockerPush = execa(
            'docker',
            [
              'push',
              `tegonhq/proj_${workspaceId.replace(/-/g, '')}:${imageVersion}.prod`,
            ],
            {
              cwd: path.dirname(config.path),
              env: { DOCKER_CONFIG: tmpDir },
            },
          );

          // Handle the output from the `docker push` command
          const handleDockerOutput = (data: Buffer) => {
            dockerSpinner.message(
              `Pushing image to docker - ${data.toString()}`,
            );
          };

          // Listen for the `stderr` and `stdout` events to handle the output
          dockerPush.stderr?.on('data', handleDockerOutput);
          dockerPush.stdout?.on('data', handleDockerOutput);

          await dockerPush;

          // Clean up the temporary directory
          await fs.promises.rm(tmpDir, { recursive: true, force: true });

          dockerSpinner.stop('Pushed docker image');

          const resourceSpinner = spinner();

          resourceSpinner.start('Creating resources...');
          await apiClient.resourceCreation(config.config, workspaceId, version); // Create resources for the deployed action
          resourceSpinner.stop(`Resources created for ${config.path}`);
        }
        cleanup(validConfigs);

        log.success('Deployment succeeded.');
      } catch (e: any) {
        log.error(e.message);
      }
    });
}

async function ensureLoggedIntoDockerRegistry(
  registryHost: string,
  auth: { username: string; password: string },
) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'tegon-'));
  const dockerConfigPath = path.join(tmpDir, 'config.json');

  const dockerConfig = {
    auths: {
      [registryHost]: {
        auth: Buffer.from(`${auth.username}:${auth.password}`).toString(
          'base64',
        ),
      },
    },
  };

  await writeFile(dockerConfigPath, JSON.stringify(dockerConfig));

  return tmpDir;
}

process.on('SIGINT', async () => {
  if (tmpDir) {
    console.log('Cleaning up temporary directory...');
    try {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } catch (err) {
      console.error(`Error cleaning up temporary directory: ${err}`);
    }
  }
  process.exit(0);
});
