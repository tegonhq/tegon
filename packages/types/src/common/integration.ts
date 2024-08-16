export interface IntegrationLifecyclePayload extends Record<string, any> {}

interface CommonInternalPayload {
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebhookData = Record<string, any>;

export interface IntegrationSpec extends CommonInternalPayload {}

export enum IntegrationPayloadEventType {
  // Get Integration Account
  GetIntegrationAccount = 'GetIntegrationAccount',

  IntegrationSpec = 'IntegrationSpec',

  // Internal configuration
  IntegrationCreate = 'IntegrationCreate',
  IntegrationDelete = 'IntegrationDelete',

  // When the extension gets a external webhook
  Webhook = 'Webhook',
}

export type IntegrationEventPayload =
  | {
      event: IntegrationPayloadEventType.IntegrationCreate;
      payload: {
        userId: string;
        workspaceId: string;
        data: IntegrationLifecyclePayload;
      };
    }
  | {
      event: IntegrationPayloadEventType.IntegrationDelete;
      payload: {
        userId: string;
        workspaceId: string;
        integrationAccountId: string;
        data: IntegrationLifecyclePayload;
      };
    }
  | {
      event: IntegrationPayloadEventType.IntegrationSpec;
      payload: {
        workspaceId?: string;
        userId: string;
      };
    }
  | {
      event: IntegrationPayloadEventType.Webhook;
      payload: {
        userId: string;
        workspaceId: string;
        data: WebhookData;
      };
    }
  | {
      event: IntegrationPayloadEventType.GetIntegrationAccount;
      payload: any;
    };
