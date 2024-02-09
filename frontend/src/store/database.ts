/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import Dexie, { liveQuery } from 'dexie';

import { WorkspaceType } from 'common/types/workspace';

import { initializeWorkspaceStore, workspaceStore } from './workspace';

export class TegonDatabase extends Dexie {
  workspace: Dexie.Table<WorkspaceType, number>; // number = type of the primary key

  constructor() {
    super('TegonDatabase');
    this.version(1).stores({
      workspace: 'id,createdAt,updatedAt,name,slug',
    });
    this.workspace = this.table('workspace');
  }
}
export const tegonDatabase = new TegonDatabase();

// Once the indexedDB database is ready initiate hooks to keep the mobx-store upto date
tegonDatabase.on('ready', () => {
  // Use liveQuery to automatically update your store
  liveQuery(() => tegonDatabase.table('workspace').toArray()).subscribe(
    (items) => {
      if (!workspaceStore) {
        initializeWorkspaceStore(items[0]);
      }
      return workspaceStore.updateWorkspace(items[0]);
    },
  );
});
