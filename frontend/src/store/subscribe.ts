/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Database, liveQuery } from 'dexie';

import { workspaceStore } from 'store/workspace';

import { labelStore } from './label';
import { teamStore } from './team';
import { workflowStore } from './workflow';

export function subscribeToSequenceChanges(tegonDatabase: Database) {
  return liveQuery(() => tegonDatabase.table('sequence').toArray()).subscribe(
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

          case 'team': {
            teamStore && teamStore.updateLastSequenceId(item.lastSequenceId);
            break;
          }
        }
      });
    },
  );
}

export function subscribeToWorkspaceChanges(tegonDatabase: Database) {
  return liveQuery(() => tegonDatabase.table('workspace').toArray()).subscribe(
    (items) => {
      workspaceStore && workspaceStore.updateWorkspace(items[0]);
    },
  );
}

export function subscribeToLabelChanges(tegonDatabase: Database) {
  return liveQuery(() => tegonDatabase.table('label').toArray()).subscribe(
    (items) => {
      items.map((item) => {
        labelStore && labelStore.updateStore(item, item.id);
      });
    },
  );
}

export function subscribeToTeamChanges(tegonDatabase: Database) {
  return liveQuery(() => tegonDatabase.table('team').toArray()).subscribe(
    (items) => {
      items.map((item) => {
        teamStore && teamStore.updateStore(item, item.id);
      });
    },
  );
}

export function subscribeToWorkflowChanges(
  tegonDatabase: Database,
  teamId: string,
) {
  return liveQuery(() => tegonDatabase.table('workflow').toArray()).subscribe(
    (items) => {
      items.map((item) => {
        workflowStore &&
          item.teamId === teamId &&
          workflowStore.updateStore(item, item.id);
      });
    },
  );
}
