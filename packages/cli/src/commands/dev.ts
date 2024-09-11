import fs from 'node:fs';
import path from 'path';

import { log, note, spinner } from '@clack/prompts';
import { Command } from 'commander';
import { execa } from 'execa';

import { login } from './login';
import { ApiClient, ConfigMap } from '../api/client';
import { commonOptions } from '../cli/common';
import { interceptAxios } from '../utilities/axios';
import {
  activeProcesses,
  checkIfConfigExist,
  cleanupConfig,
  createTriggerConfigFile,
  validateAndExportConfig,
} from '../utilities/configValidation';
import { getVersion } from '../utilities/getVersion';
import { printInitialBanner } from '../utilities/initialBanner';

export function configureDevCommand(program: Command) {
  return commonOptions(
    program.command('dev').description('Run your Tegon action with hot reload'),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async () => {
      await printInitialBanner();
      await devCommand();
    });
}

async function devCommand() {
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
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;

    const resourceSpinner = spinner();

    resourceSpinner.start('Creating resources...');
    await apiClient.resourceCreation(config.config, workspaceId, version, true); // Create resources for the deployed action
    resourceSpinner.stop(`Resources created for ${config.path}`);

    const s = spinner();
    s.start(`Dev mode ${config.path} (v${version})`);

    // Deploy the action using trigger.dev
    const devProcess = execa('npx', ['trigger.dev@beta', 'dev'], {
      cwd: path.dirname(config.path),
      stdio: 'inherit',
    });

    activeProcesses.push(devProcess);
    await devProcess;

    await cleanAction(apiClient, config, authorization.auth.workspaceId);
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
