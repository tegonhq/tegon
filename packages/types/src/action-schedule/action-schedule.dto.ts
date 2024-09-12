import { ActionScheduleStatusEnum } from './action-schedule.entity';

export class ActionScheduleParamsDto {
  actionSlug: string;
  actionScheduleId: string;
}

export class ActionScheduleDto {
  cron: string;
  timezone?: string;
  status?: ActionScheduleStatusEnum;
  workspaceId?: string;
}

export class ActionScheduleTriggerParamsDto {
  actionId: string;
  actionEntityId: string;
}
