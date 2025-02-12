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
          const packageJsonPath = path.join(
            path.dirname(config.path),
            'package.json',
          );
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf-8'),
          );
          const version = packageJson.version;

          const s = spinner();
          s.start(`Building action ${config.path} (v${version})`);

          // Deploy the action using trigger.dev
          const buildProcess = execa('pnpm', ['build'], {
            cwd: path.dirname(config.path),
          });

          const handleProcessOutput = (data: Buffer) => {
            s.message(
              `building ${config.path} (v${version}) - ${data.toString().trim()}`,
            );
          };

          buildProcess.stderr?.on('data', handleProcessOutput);
          buildProcess.stdout?.on('data', handleProcessOutput);

          await buildProcess;

          s.message('Uploading the build file to server');

          const filePath = path.join(config.path, 'dist', 'index.js');
          const file = new File([fs.readFileSync(filePath)], 'index.js', {
            type: 'application/javascript',
          });

          const publicURL = await apiClient.uploadActionFile(file);

          note(`Uploaded file to server ${publicURL}`);
          const resourceSpinner = spinner();

          s.stop(`Building successful for ${config.path}`);

          resourceSpinner.start('Creating resources...');
          await apiClient.resourceCreation(
            { ...config.config, url: publicURL },
            version,
          ); // Create resources for the deployed action
          resourceSpinner.stop(`Resources created for ${config.path}`);
        }

        log.success('Deployment succeeded.');
      } catch (e: any) {
        log.error(e.message);
      }
    });
}
