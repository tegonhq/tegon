export enum ActionTypesEnum {
  ON_CREATE = 'on_create',
  ON_UPDATE = 'on_update',
  ON_DELETE = 'on_delete',
  SOURCE_WEBHOOK = 'source_webhook',
  GET_INPUTS = 'get_inputs',
}

export interface ActionEventPayload {
  event: ActionTypesEnum;
  [x: string]: any;
}
