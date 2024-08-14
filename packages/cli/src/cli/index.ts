import { Command } from 'commander';

import { COMMAND_NAME } from '../consts';
import { getVersion } from '../utilities/getVersion';

export const program = new Command();

program
  .name(COMMAND_NAME)
  .description('Add, run and deploy tegon actions with the cli')
  .version(getVersion(), '-v, --version', 'Display the version number');
