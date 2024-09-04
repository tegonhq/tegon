import { Command } from 'commander';
import { commonOptions } from '../cli/common';
import { getVersion } from '../utilities/getVersion';
import path from 'path';
import { spinner, intro, outro } from '@clack/prompts';
import { printInitialBanner } from '../utilities/initialBanner';
import degit from 'degit';
import fs from 'node:fs';

export function configureInitCommand(program: Command) {
  return commonOptions(
    program
      .command('init')
      .description('Init a tegon action')
      .option(
        '-a, --action <name>',
        'Name of the action folder to initialize',
        'base',
      ),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async (options) => {
      await printInitialBanner(false);

      const { action } = options;
      const repoUrl = `tegonhq/tegon/actions/${action}`;
      const actionFolderPath = path.join(process.cwd(), action);

      // Start loading prompt
      intro(`Initializing with action: ${action}`);
      const fetchSpinner = spinner();

      try {
        // Check if the action folder already exists locally
        if (fs.existsSync(actionFolderPath)) {
          fetchSpinner.stop('Action folder already exists locally.');
          outro('Initialization aborted.');
          return;
        }

        fetchSpinner.start('Fetching the action folder...');

        // Use degit to fetch the specific folder from the repository
        const emitter = degit(repoUrl);
        await emitter.clone('.');

        fetchSpinner.stop('Action folder successfully downloaded.');
        outro('Project initialized.');
      } catch (error) {
        fetchSpinner.stop('Failed to fetch the action folder.');
        console.error(error);
      }
    });
}
