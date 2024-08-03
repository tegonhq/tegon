import type { IntegrationAccountWithRelations } from './integration-account';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventBody = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHeaders = Record<string, any>;

export interface WebhookPayload {
  eventHeaders: EventHeaders;
  eventBody: EventBody;
  integrationAccount?: IntegrationAccountWithRelations;
  userId?: string;
  accesstoken?: string;
}
