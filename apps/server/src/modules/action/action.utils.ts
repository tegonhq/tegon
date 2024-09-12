import fsModule from 'fs/promises';
import { tmpdir } from 'node:os';
import pathModule from 'node:path';

import { Action } from '@tegonhq/types';
import axios from 'axios';

import { Env } from 'modules/triggerdev/triggerdev.interface';

// Create a temporary directory within the OS's temp directory
export async function createTempDir(): Promise<string> {
  // Generate a unique temp directory path
  const tempDirPath: string = pathModule.join(tmpdir(), 'tegon-temp-');

  // Create the temp directory synchronously and return the path
  const directory = await fsModule.mkdtemp(tempDirPath);

  return directory;
}

export async function getExternalActions() {
  const actionsUrl =
    'https://raw.githubusercontent.com/tegonhq/tegon/main/actions/actions.json';
  const response = await axios.get(actionsUrl);
  const actions = response.data;

  return await Promise.all(
    actions.map(async (action: { slug: string }) => {
      const config = await getActionConfig(action.slug);
      return {
        ...action,
        config,
      };
    }),
  );
}

export async function getExternalActionWithSlug(slug: string) {
  const actionsUrl =
    'https://raw.githubusercontent.com/tegonhq/tegon/main/actions/actions.json';
  const response = await axios.get(actionsUrl);
  const actions = response.data;
  const action = actions.find(
    (action: { slug: string }) => action.slug === slug,
  );

  const description = await getActionReadme(slug);

  return { ...action, guide: description };
}

export async function getActionConfig(slug: string) {
  try {
    const actionsDir =
      'https://raw.githubusercontent.com/tegonhq/tegon/main/actions';
    const configUrl = `${actionsDir}/${slug}/config.json`;
    const response = await axios.get(configUrl);
    return response.data;
  } catch (e) {
    return {};
  }
}

export async function getActionReadme(slug: string) {
  try {
    const actionsDir =
      'https://raw.githubusercontent.com/tegonhq/tegon/main/actions';
    const configUrl = `${actionsDir}/${slug}/README.md`;
    const response = await axios.get(configUrl);
    return response.data;
  } catch (e) {
    return undefined;
  }
}

export function getActionEnv(action: Action) {
  return action.isDev ? Env.DEV : Env.PROD;
}
