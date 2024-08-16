import { Action } from '../action/action.entity';

export class ActionEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  type: string;
  entity: string;

  action?: Action;
  actionId: string;
}
