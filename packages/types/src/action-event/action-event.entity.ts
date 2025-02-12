export class ActionEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  eventType: string;
  modelName: string;
  modelId: string;
  eventData: any;

  sequenceId: bigint;
  workspaceId: string;
}
