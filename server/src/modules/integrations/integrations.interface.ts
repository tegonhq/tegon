/** Copyright (c) 2024, Tegon, all rights reserved. **/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostRequestBody = Record<string, any>;

export type RequestHeaders = Record<'headers', Record<string, string>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventBody = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHeaders = Record<string, any>;

export type labelDataType = Record<string, string>;

export interface TiptapAttrs {
  src?: string;
  alt?: string;
  href?: string;
  type?: string;
  target?: string;
  rel?: string;
  class?: string;
  tight?: boolean;
  start?: number;
  language?: string;
}

export interface TiptapMarks {
  type: string;
  attrs?: TiptapAttrs;
}

export interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMarks[];
  attrs?: TiptapAttrs;
}
