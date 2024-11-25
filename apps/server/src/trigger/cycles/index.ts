import { PrismaClient } from '@prisma/client';
import { CycleStatusEnum } from '@tegonhq/types';
import { logger, schedules } from '@trigger.dev/sdk/v3';

interface Payload {
  type: 'DECLARATIVE' | 'IMPERATIVE';
  timestamp: Date;
  timezone: string;
  scheduleId: string;
  upcoming: Date[];
  lastTimestamp?: Date;
  externalId?: string;
}

const prisma = new PrismaClient();

export const closeCyclesSchedule = schedules.task({
  id: 'close-cycles',
  run: async (payload: Payload) => {
    logger.info(`Starting cycle closure check at ${payload.timestamp}`);

    try {
      // Find all cycles that have ended but haven't been marked as completed
      const endedCycles = await prisma.cycle.findMany({
        where: {
          endDate: {
            lte: new Date(),
          },
          deleted: null,
        },
        include: {
          team: true,
        },
      });

      if (endedCycles.length === 0) {
        logger.info('No cycles to close');
        return {};
      }

      logger.info(`Found ${endedCycles.length} cycles to close`);

      // Update all cycles in a transaction
      const result = await prisma.$transaction(
        endedCycles.flatMap((endCycle) => [
          // Update cycle
          prisma.cycle.update({
            where: { id: endCycle.id },
            data: {
              status: CycleStatusEnum.COMPLETED,
              closedAt: new Date(),
            },
          }),
          // Update team
          prisma.team.update({
            where: { id: endCycle.team.id },
            data: { currentCycle: endCycle.number + 1 },
          }),
        ]),
      );

      logger.info(`Successfully closed ${result.length} cycles`);

      return result;
    } catch (error) {
      logger.error('Error in cycle closure schedule', { error });
      throw error;
    }
  },
});
