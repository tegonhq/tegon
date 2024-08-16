import { JsonValue } from '../common';

export class ActionEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  eventType: string;
  modelName: string;
  modelId: string;
  eventData: JsonValue;

  sequenceId: bigint;
  workspaceId: string;
}
