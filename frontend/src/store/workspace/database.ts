/** Copyright (c) 2024, Tegon, all rights reserved. **/

import Dexie from 'dexie';

import { Workspace } from './models';

export class WorkspaceDatabase extends Dexie {
  workspace: Dexie.Table<typeof Workspace, number>; // number = type of the primary key

  constructor() {
    super('WorkspaceDatabase');
    this.version(1).stores({
      workspace: '++id,createdAt,updatedAt,name,slug',
    });
    this.workspace = this.table('workspace');
  }
}
