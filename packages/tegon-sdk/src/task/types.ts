import { ActionEventPayload, JsonObject, JsonValue } from '@tegonhq/types';

// This is used to fetch integration Account and the user token
// for all later sdk operations
// By default we get the token for the user who connected the integration account
export interface InitFunctionReturn {
  accountId: string;
  userId?: string;
}

export type InitFunction = (
  payload: ActionEventPayload,
) => Promise<InitFunctionReturn>;

export type RunFunction = (payload: ActionEventPayload) => Promise<JsonObject>;

export type ScheduleRunFunction = () => Promise<JsonValue>;
