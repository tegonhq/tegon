const SUPPORTED_TYPES = ['GuildMessageReactions'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isActionSupportedEvent(payload: any) {
  return SUPPORTED_TYPES.includes(payload.t);
}
