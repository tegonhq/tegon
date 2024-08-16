import { JSONObject } from 'supertokens-node/types';

export class CreateActionEvent {
  eventType: string;
  eventData: JSONObject;

  modelName: string;
  modelId: string;

  sequenceId: string;
  workspaceId: string;
}
