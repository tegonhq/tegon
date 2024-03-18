/** Copyright (c) 2024, Tegon, all rights reserved. **/

export class WebhookEventParams {
  eventSource: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebhookEventBody = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebhookEventHeaders = Record<string, any>;
