const SUPPORTED_TYPES = ['assigned', 'triggered'];

interface Payload {
  action: string;
}

export function isActionSupportedEvent(payload: Payload) {
  return SUPPORTED_TYPES.includes(payload.action);
}
