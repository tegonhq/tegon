import { log, note } from '@clack/prompts';
import { Command } from 'commander';

import { login } from './login';
import { ApiClient, ConfigMap } from '../api/client';
import { commonOptions } from '../cli/common';
import { interceptAxios } from '../utilities/axios';
import {
  activeProcesses,
  checkIfConfigExist,
  cleanupConfig,
  validateAndExportConfig,
} from '../utilities/configValidation';
import { getVersion } from '../utilities/getVersion';
import { printInitialBanner } from '../utilities/initialBanner';

export function configureDevCleanupCommand(program: Command) {
  return commonOptions(
    program
      .command('dev-cleanup')
      .description('Run your Tegon action with hot reload'),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async () => {
      await printInitialBanner();
      await devCleanup();
    });
}

async function devCleanup() {
  const authorization = await login(true);

  if (!authorization) {
    throw new Error(`You must login first. Use the \`login\` CLI command.\n\n`);
  }

  try {
    interceptAxios(authorization.auth.accessToken);
    const workspaceId = authorization.auth.workspaceId;

    const apiClient = new ApiClient(authorization.auth.apiUrl);

    const cwd = process.cwd(); // Get the current working directory
    const configExist = checkIfConfigExist(cwd);
    const validConfig = await validateAndExportConfig(cwd, 'config.json'); // Validate and export the found config files
    note(`Valid config found`);

    if (!configExist && validConfig) {
      log.error('config.json not found. Exiting...');
      process.exit(1);
    }

    let config = validConfig as ConfigMap;
    config = {
      ...config,
      config: { ...config.config, slug: `${config.config.slug}-dev` },
    };

    await cleanAction(apiClient, config, workspaceId);
  } catch (e: any) {
    log.error(e.message);

    process.exit(1);
  }
}

async function cleanAction(
  apiClient: ApiClient,
  config: ConfigMap,
  workspaceId: string,
) {
  log.step('Cleaning before exiting...');
  await apiClient.cleanResources(config, workspaceId);

  cleanupConfig(config);

  // Kill all active processes
  for (const proc of activeProcesses) {
    if (proc && proc.kill) {
      proc.kill('SIGTERM');
    }
  }

  process.exit(0);
}
