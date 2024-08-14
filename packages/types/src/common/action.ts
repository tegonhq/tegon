export enum ActionTypesEnum {
  OnCreate = 'OnCreate',
  OnUpdate = 'OnUpdate',
  OnDelete = 'OnDelete',
  OnAssign = 'OnAssign',
  OnLabel = 'OnLabel',
  OnPriority = 'OnPriority',
  OnStatus = 'OnStatus',
  ExternalWebhook = 'ExternalWebhook',
}

export interface ActionPayload extends Record<string, any> {}

export type ActionEventPayload =
  | {
      event: ActionTypesEnum.OnCreate;
      payload: {
        userId: string;
        data: ActionPayload;
      };
    }
  | {
      event: ActionTypesEnum.OnUpdate;
      payload: {
        userId: string;
        data: ActionPayload;
      };
    }
  | {
      event: ActionTypesEnum.ExternalWebhook;
      payload: {
        userId: string;
        data: ActionPayload;
      };
    };
