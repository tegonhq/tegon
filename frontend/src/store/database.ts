/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import Dexie from 'dexie';

import { LabelType } from 'common/types/label';
import { SequenceType } from 'common/types/sequence';
import { TeamType, WorkflowType } from 'common/types/team';
import { WorkspaceType } from 'common/types/workspace';

import { MODELS } from './models';

export class TegonDatabase extends Dexie {
  workspace: Dexie.Table<WorkspaceType, string>;
  sequence: Dexie.Table<SequenceType, string>;
  label: Dexie.Table<LabelType, string>;
  team: Dexie.Table<TeamType, string>;
  workflow: Dexie.Table<WorkflowType, string>;

  constructor() {
    super('TegonDatabase');

    this.version(1).stores({
      [MODELS.Workspace]: 'id,createdAt,updatedAt,name,slug',
      sequence: 'id,lastSequenceId',
      [MODELS.Label]:
        'id,createdAt,updatedAt,name,color,description,workspaceId,groupId,teamId',
      [MODELS.Team]: 'id,createdAt,updatedAt,name,identifier,workspaceId',
      [MODELS.Workflow]:
        'id,createdAt,updatedAt,name,position,color,category,teamId',
    });

    this.workspace = this.table(MODELS.Workspace);
    this.sequence = this.table('sequence');
    this.label = this.table(MODELS.Label);
    this.team = this.table(MODELS.Team);
    this.workflow = this.table(MODELS.Workflow);
  }
}

export const tegonDatabase = new TegonDatabase();
