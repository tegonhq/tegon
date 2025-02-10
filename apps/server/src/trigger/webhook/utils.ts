import { ActionTypesEnum } from '@tegonhq/types';

export function getEventType(eventType: ActionTypesEnum) {
  switch (eventType) {
    case ActionTypesEnum.ON_CREATE:
      return 'create';
    case ActionTypesEnum.ON_UPDATE:
      return 'update';
    case ActionTypesEnum.ON_DELETE:
      return 'delete';
  }

  return null;
}
