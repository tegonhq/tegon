import { Action } from '../action/action.entity';

export const ActionScheduleStatus = {
  ACTIVE: 'ACTIVE',
  IN_ACTIVE: 'IN_ACTIVE',
  DELETED: 'DELETED',
};

export enum ActionScheduleStatusEnum {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED',
}

export type ActionScheduleStatus =
  (typeof ActionScheduleStatus)[keyof typeof ActionScheduleStatus];

export class ActionSchedule {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  cron?: string;
  scheduleId?: string;
  status: ActionScheduleStatus;
  timezone?: string;

  scheduledById: string;
  action?: Action;
  actionId: string;
}
