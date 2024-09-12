import { Command } from 'commander';
import { z } from 'zod';

import {
  CommonCommandOptions,
  commonOptions,
  wrapCommandAction,
} from '../cli/common.js';
import {
  deleteAuthConfigProfile,
  readAuthConfigProfile,
} from '../utilities/configFiles.js';
import { printInitialBanner } from '../utilities/initialBanner.js';
import { logger } from '../utilities/logger.js';
import { deleteAuthConfigProfile as triggerDelete } from '../utilities/triggerConfigFiles.js';

const LogoutCommandOptions = CommonCommandOptions;

type LogoutCommandOptions = z.infer<typeof LogoutCommandOptions>;

export function configureLogoutCommand(program: Command) {
  return commonOptions(
    program.command('logout').description('Logout of Tegon'),
  ).action(async (options) => {
    await printInitialBanner();
    await logoutCommand(options);
  });
}

export async function logoutCommand(options: unknown) {
  return await wrapCommandAction(
    'logoutCommand',
    LogoutCommandOptions,
    options,
    async () => {
      return await logout();
    },
  );
}

export async function logout() {
  const config = readAuthConfigProfile();

  if (!config?.accessToken) {
    logger.info(`You are already logged out`);
    return;
  }

  deleteAuthConfigProfile();
  triggerDelete();

  logger.info(`Logged out of Tegon`);
}
