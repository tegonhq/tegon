import fs from 'node:fs';
import path from 'path';

import '../utilities/axios';
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
            [
              'trigger.dev@beta',
              'deploy',
              '--self-hosted',
              '--push',
              '--skip-typecheck',
            ],
            {
              cwd: path.dirname(config.path),
            },
          );

          const handleProcessOutput = (data: Buffer) => {
            s.message(
              `Deploying ${config.path} (v${version}) - ${data.toString()}`,
            );
          };

          deployProcess.stderr?.on('data', handleProcessOutput);
          deployProcess.stdout?.on('data', handleProcessOutput);

          await deployProcess;

          s.stop(`Deployment successful for ${config.path}`);

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
