/** Copyright (c) 2024, Tegon, all rights reserved. **/

const enum Action {
  'I' = 'I',
  'U' = 'U',
  'D' = 'D',
}

export interface SyncActionRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  modelName: string;
  modelId: string;
  action: Action;
  workspaceId: string;
  sequenceId: string;
}

export interface BootstrapResponse {
  syncActions: SyncActionRecord[];
  lastSequenceId: string;
}
