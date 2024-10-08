const SUPPORTED_TYPES = ['assigned'];

interface Payload {
  action: string;
}

export function isActionSupportedEvent(payload: Payload) {
  return SUPPORTED_TYPES.includes(payload.action);
}
