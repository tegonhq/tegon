import { IntegrationAccount } from '../integration-account';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventBody = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHeaders = Record<string, any>;

export interface WebhookPayload {
  eventBody: EventBody;
  eventHeaders: EventHeaders;
  integrationAccounts: Record<string, IntegrationAccount>;
  userId: string;
}
