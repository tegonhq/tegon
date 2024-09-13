import { PrismaClient } from '@prisma/client';
import { logger, schedules } from '@trigger.dev/sdk/v3';
import axios from 'axios';

interface Payload {
  type: 'DECLARATIVE' | 'IMPERATIVE';
  timestamp: Date;
  timezone: string;
  scheduleId: string;
  upcoming: Date[];
  lastTimestamp?: Date | undefined;
  externalId?: string | undefined;
}
const prisma = new PrismaClient();

export const scheduleProxy = schedules.task({
  id: 'schedule-proxy',
  run: async (payload: Payload) => {
    const actionSchedule = await prisma.actionSchedule.findUnique({
      where: { id: payload.externalId },
      include: { action: true },
    });

    const pat = actionSchedule.action.isPersonal
      ? await prisma.personalAccessToken.findFirst({
          where: {
            workspaceId: actionSchedule.action.workspaceId,
            userId: actionSchedule.action.createdById,
            type: 'user',
          },
        })
      : await prisma.personalAccessToken.findFirst({
          where: {
            workspaceId: actionSchedule.action.workspaceId,
            user: { username: actionSchedule.action.slug },
            type: 'trigger',
          },
        });

    if (!pat) {
      logger.error('No pat found');
      return;
    }

    return (
      await axios.post(
        `${process.env.FRONTEND_HOST}/api/v1/action/${actionSchedule.action.id}/trigger-scheduled`,
        {},
        { headers: { Authorization: `Bearer ${pat.token}` } },
      )
    ).data;
  },
});
