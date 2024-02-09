/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { tegonDatabase } from 'store/database';

const enum Action {
  'I' = 'I',
  'U' = 'U',
  'D' = 'D',
}

interface BootstrapRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  modelName: string;
  modelId: string;
  action: Action;
  workspaceId: string;
  sequenceId: number;
}

// Saves the data from the socket, bootstrap and delta sync into the indexedDB
export async function saveBootstrapData(data: BootstrapRecord[]) {
  await Promise.all(
    data.map(async (record: BootstrapRecord) => {
      if (record.modelName === 'Workspace') {
        return await tegonDatabase.workspace.put({
          id: record.data.id,
          createdAt: record.data.createdAt,
          updatedAt: record.data.updatedAt,
          name: record.data.name,
          slug: record.data.slug,
        });
      }
    }),
  );
}
