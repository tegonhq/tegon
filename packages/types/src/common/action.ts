export enum ActionTypesEnum {
  ON_CREATE = 'on_create',
  ON_UPDATE = 'on_update',
  ON_DELETE = 'on_delete',
  SOURCE_WEBHOOK = 'SOURCE_WEBHOOK',
}

export interface ActionPayload extends Record<string, any> {}

export interface ActionEventPayload {
  type: ActionTypesEnum;
  data: ActionPayload;
}
