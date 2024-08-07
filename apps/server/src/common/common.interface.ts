export type TiptapListTypes = 'orderedList' | 'bulletList' | 'taskList' | null;
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
  level?: number;
  checked?: boolean;
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
