import { Command } from 'commander';

import { configureDeployCommand } from '../commands/deploy';
import { configureInitCommand } from '../commands/init';
import { configureLoginCommand } from '../commands/login';
import { configureLogoutCommand } from '../commands/logout';
import { COMMAND_NAME } from '../consts';
import { getVersion } from '../utilities/getVersion';

export const program = new Command();

program
  .name(COMMAND_NAME)
  .description('Cli to run tegon actions')
  .version(getVersion(), '-v, --version', 'Display the version number');

configureDeployCommand(program);
configureInitCommand(program);
configureLoginCommand(program);
configureLogoutCommand(program);
