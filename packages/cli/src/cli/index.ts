import { Command } from 'commander';

import { COMMAND_NAME } from '../consts';
import { getVersion } from '../utilities/getVersion';
import { configureDeployCommand } from '../commands/deploy';

export const program = new Command();

program
  .name(COMMAND_NAME)
  .description('Cli to run tegon actions')
  .version(getVersion(), '-v, --version', 'Display the version number');

configureDeployCommand(program);
