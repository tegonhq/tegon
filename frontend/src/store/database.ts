/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import Dexie from 'dexie';

import { LabelType } from 'common/types/label';
import { SequenceType } from 'common/types/sequence';
import { TeamType, WorkflowType } from 'common/types/team';
import { WorkspaceType } from 'common/types/workspace';

export class TegonDatabase extends Dexie {
  workspace: Dexie.Table<WorkspaceType, string>;
  sequence: Dexie.Table<SequenceType, string>;
  label: Dexie.Table<LabelType, string>;
  team: Dexie.Table<TeamType, string>;
  workflow: Dexie.Table<WorkflowType, string>;

  constructor() {
    super('TegonDatabase');
    this.version(1).stores({
      workspace: 'id,createdAt,updatedAt,name,slug',
      sequence: 'id,lastSequenceId',
      label:
        'id,createdAt,updatedAt,name,color,description,workspaceId,groupId,teamId',
      team: 'id,createdAt,updatedAt,name,identifier,workspaceId',
      workflow: 'id,createdAt,updatedAt,name,position,color,category,teamId',
    });

    this.workspace = this.table('workspace');
    this.sequence = this.table('sequence');
    this.label = this.table('label');
    this.team = this.table('team');
    this.workflow = this.table('workflow');
  }
}

export const tegonDatabase = new TegonDatabase();
