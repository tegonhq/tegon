import { schedules } from '@trigger.dev/sdk/v3';

interface Payload {
  type: 'DECLARATIVE' | 'IMPERATIVE';
  timestamp: Date;
  timezone: string;
  scheduleId: string;
  upcoming: Date[];
  lastTimestamp?: Date | undefined;
  externalId?: string | undefined;
}

export const scheduleProxy = schedules.task({
  id: 'schedule-proxy',
  run: (payload: Payload) => {
    console.log(payload);
    return null;
  },
});
