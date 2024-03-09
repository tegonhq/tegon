/** Copyright (c) 2024, Tegon, all rights reserved. **/

export class WebhookEventParams {
  eventSource: string;
}

export type WebhookEventBody = Record<string, any>

export type WebhookEventHeaders = Record<string, any>