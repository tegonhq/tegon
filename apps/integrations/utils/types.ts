import { IntegrationEventPayload, JsonValue } from '@tegonhq/types';

export interface InitFunctionReturn {
  accountId: string;
  userAccountId?: string;
  userId?: string;
}

export type InitFunction = (
  payload: IntegrationEventPayload,
) => Promise<InitFunctionReturn>;

export type RunFunction = (
  payload: IntegrationEventPayload,
) => Promise<JsonValue>;
