import { Command } from 'commander';
import { commonOptions } from '../cli/common';
import { getVersion } from '../utilities/getVersion';
import path from 'path';
import { note, log } from '@clack/prompts';
import { execa } from 'execa';
import { printInitialBanner } from '../utilities/initialBanner';

export function configureInitCommand(program: Command) {
  return commonOptions(
    program
      .command('deploy')
      .description('deploy tegon actions to tegon servers')
      .requiredOption(
        '-r, --repo <url>',
        'GitHub repository URL',
        'https://github.com/user/repo',
      )
      .option(
        '-d, --destination <path>',
        'Destination path to clone repository',
        '.',
      ),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async (options) => {
      await printInitialBanner(false);
      const repoUrl = options.repo;
      const destinationPath = path.resolve(process.cwd(), options.destination);

      note(`Cloning repository from ${repoUrl} to ${destinationPath}`);

      try {
        await execa('npx', ['degit', repoUrl, destinationPath]);
        log.info('Repository successfully cloned.');
      } catch (error: any) {
        log.error(`Error cloning repository: ${error.message}`);
      }
    });
}
