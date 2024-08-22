import { Command } from 'commander';
import { commonOptions } from '../cli/common';
import { getVersion } from '../utilities/getVersion';
import path from 'path';
import fs from 'node:fs';
import { note, log, spinner } from '@clack/prompts';
import { execa } from 'execa';
import { printInitialBanner } from '../utilities/initialBanner';
import { readJSONFileSync } from '../utilities/fileSystem';
import axios from 'axios';
import '../utilities/axios';

export function configureDeployCommand(program: Command) {
  return commonOptions(
    program
      .command('deploy')
      .description('deploy tegon actions to tegon servers')
      .requiredOption('-w, --workspace-id <workspaceId>', 'Workspace ID'),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async (options) => {
      const workspaceId = options.workspaceId as string;
      await printInitialBanner(false);

      try {
        const triggerAccessToken = await getTriggerAccessToken(workspaceId);

        const cwd = process.cwd();
        const configPaths = checkConfigFiles(cwd);

        const validConfigs = await validateAndExportConfigs(configPaths, cwd);
        note(`Valid configs found: ${validConfigs.length}`);

        if (configPaths.length === 0) {
          log.error('config.json not found. Exiting...');
          process.exit(1);
        }

        for (const config of validConfigs) {
          const triggerDir = path.join(path.dirname(config.path), 'trigger');
          if (!fs.existsSync(triggerDir)) {
            fs.mkdirSync(triggerDir, { recursive: true });
          }

          const handlerName = `handler${config.config.name.replace(/-/g, '_')}`;
          const triggerIndexPath = path.join(triggerDir, 'index.ts');
          const triggerIndexContent = `
            import { run } from '../index';
            import { handler } from '@tegonhq/sdk';

            export const ${handlerName} = handler('${config.config.name}', run);
          `.trim();

          fs.writeFileSync(triggerIndexPath, triggerIndexContent);
          createTriggerConfigFile(path.dirname(config.path), workspaceId);
          const packageJsonPath = path.join(path.dirname(config.path), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          const version = packageJson.version;
          
          const s = spinner();
          s.start(`Deploying ${config.path} (v${version})`);

          await execa(
            'npx',
            ['trigger.dev@beta', 'deploy', '--self-hosted', '--skip-typecheck'],
            {
              cwd: path.dirname(config.path),
              env: {
                ...process.env,
                TRIGGER_ACCESS_TOKEN: triggerAccessToken,
                TRIGGER_API_URL:
                  process.env.TRIGGER_HOST || 'https://trigger.tegon.ai',
              },
            },
          );

          s.stop(`Deployment successful for ${config.path}`);

          // Delete trigger.config.ts and trigger folder
          const triggerConfigPath = path.join(
            path.dirname(config.path),
            'trigger.config.ts',
          );
          fs.unlinkSync(triggerConfigPath);
          fs.rmSync(triggerDir, { recursive: true });

          const resourceSpinner = spinner();

          resourceSpinner.start('Creating resources...');
          await resourceCreation(config.config, workspaceId, version);
          resourceSpinner.stop(`Resources created for ${config.path}`);
        }

        log.success('Deployment succeeded.');
      } catch (e: any) {
        log.error(e.message);
        process.exit(1);
      }
    });
}

async function getTriggerAccessToken(workspaceId: string): Promise<string> {
  try {
    const baseURL = process.env.BASE_HOST || 'https://app.tegon.ai/api';

    const response = await axios.get(`${baseURL}/v1/triggerdev`, {
      params: { workspaceId },
    });
    return response.data.triggerKey;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(
        `The token you passed is invalid create a personal token in the app: ${error}`,
      );
    } else {
      log.error(`Unexpected error: ${error}`);
    }
    process.exit(1);
  }
}

// Utility function to check for all config.json files
const checkConfigFiles = (dir: string): string[] => {
  const foundConfigs: string[] = [];

  // Check for config.json in the root directory
  const rootConfigPath = path.join(dir, 'config.json');
  if (fs.existsSync(rootConfigPath)) {
    foundConfigs.push(rootConfigPath);
  }

  // Check each subdirectory one level down for config.json
  const subDirs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(dir, dirent.name));

  for (const subDir of subDirs) {
    const subConfigPath = path.join(subDir, 'config.json');
    if (fs.existsSync(subConfigPath)) {
      foundConfigs.push(subConfigPath);
    }
  }

  return foundConfigs;
};

interface ConfigMap {
  path: string;
  config: any;
}

async function validateAndExportConfigs(
  configPaths: string[],
  cwd: string,
): Promise<ConfigMap[]> {
  const validConfigs: ConfigMap[] = [];

  for (const configPath of configPaths) {
    const dir = path.dirname(configPath);
    const indexPath = path.join(dir, 'index.ts');

    if (!fs.existsSync(indexPath)) {
      log.error(`index.ts not found at ${indexPath}`);
      continue;
    }

    log.info(`Found index.ts at ${indexPath}`);

    const config = readJSONFileSync(configPath);
    const relativeDir = './' + path.relative(cwd, dir);

    validConfigs.push({ path: relativeDir, config });
  }

  return validConfigs;
}

async function resourceCreation(config: ConfigMap, workspaceId: string, version: string) {
  try {
    const baseURL = process.env.BASE_HOST || 'https://app.tegon.ai/api';
    await axios.post(`${baseURL}/v1/action/create-resource`, {
      workspaceId,
      config,
      version,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(
        `Error creating resources: ${JSON.stringify(error.response?.data)}`,
      );
    } else {
      log.error(`Unexpected error: ${error}`);
    }

    process.exit(1);
  }
}

// Utility function to create trigger.conf.json
const createTriggerConfigFile = (dir: string, workspaceId: string) => {
  const triggerConfigPath = path.join(dir, 'trigger.config.ts');
  const triggerConfigContent = `export const config = {
  project: 'proj_${workspaceId.replace(/-/g, '')}',
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 1,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  triggerDirectories: ['./trigger'],
};`;

  fs.writeFileSync(triggerConfigPath, triggerConfigContent.trim());
};
