/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface HistoryMessage {
  id: string;
  threadId: string;
}

export interface History {
  id: string;
  messages: HistoryMessage[];
}

export interface HistoryBody {
  history?: History[];
  historyId: string;
}

export interface GmailHeaders {
  headers: { 'Content-Type': string; Authorization: string };
}

export interface PartHeader {
  name: string;
  value: string;
}

export interface Part {
  partId: string;
  mimeType: string;
  filename: string;
  headers: PartHeader[];
  body: {
    size: number;
    data?: string;
    attachmentId?: string;
  };
  parts?: Part[];
}

export interface GmailAttachment {
  filename: string;
  mimetype: string;
  attachmentId: string;
}
