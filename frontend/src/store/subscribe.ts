/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Database, liveQuery } from 'dexie';

import { workspaceStore } from 'store/workspace';

import { labelStore } from './label';

export function subscribeToSequenceChanges(tegonDatabase: Database) {
  liveQuery(() => tegonDatabase.table('sequence').toArray()).subscribe(
    (items) => {
      items.map((item) => {
        switch (item.id) {
          case 'workspace': {
            workspaceStore &&
              workspaceStore.updateLastSequenceId(item.lastSequenceId);
            break;
          }

          case 'label': {
            labelStore && labelStore.updateLastSequenceId(item.lastSequenceId);
            break;
          }
        }
      });
    },
  );
}

export function subscribeToWorkspaceChanges(tegonDatabase: Database) {
  liveQuery(() => tegonDatabase.table('workspace').toArray()).subscribe(
    (items) => {
      workspaceStore && workspaceStore.updateWorkspace(items[0]);
    },
  );
}

export function subscribeToLabelChanges(tegonDatabase: Database) {
  liveQuery(() => tegonDatabase.table('label').toArray()).subscribe((items) => {
    items.map((item) => {
      labelStore && labelStore.updateStore(item, item.id);
    });
  });
}
