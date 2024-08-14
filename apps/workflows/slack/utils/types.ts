import { ActionEventPayload, JsonValue } from '@tegonhq/types';

export interface InitFunctionReturn {
  accountId: string;
  userAccountId?: string;
  userId?: string;
}

export type InitFunction = (
  payload: ActionEventPayload,
) => Promise<InitFunctionReturn>;

export type RunFunction = (payload: ActionEventPayload) => Promise<JsonValue>;
