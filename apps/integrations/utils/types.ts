import { IntegrationEventPayload, JsonValue } from '@tegonhq/types';

export interface InitFunctionReturn {
  accountId?: string;
  userId?: string;
}

export type InitFunction = (
  payload: IntegrationEventPayload,
) => Promise<InitFunctionReturn> | null;

export type RunFunction = (
  payload: IntegrationEventPayload,
) => Promise<JsonValue>;
