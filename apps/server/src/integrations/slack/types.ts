export interface SlackBlock {
  type: string;
  elements?: SlackElement[];
  text?: Record<string, string | boolean>;
  image_url?: string;
  alt_text?: string;
}

export interface SlackElement {
  type: string;
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  url?: string;
  elements?: SlackElement[];
}
