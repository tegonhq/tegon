const SUPPORTED_TYPES = ['MESSAGE_REACTION_ADD'];

interface Payload {
  t: string;
}

export function isActionSupportedEvent(payload: Payload) {
  console.log(payload.t);
  return SUPPORTED_TYPES.includes(payload.t);
}
