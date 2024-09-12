const SUPPORTED_TYPES = ['MESSAGE_REACTION_ADD', 'MESSAGE_CREATE'];

interface Payload {
  t: string;
}

export function isActionSupportedEvent(payload: Payload) {
  return SUPPORTED_TYPES.includes(payload.t);
}
