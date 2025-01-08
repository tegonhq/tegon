import { Injectable } from '@nestjs/common';
import {
  Cycle,
  CycleStatusEnum,
  TeamPreferenceDto,
  UpdateCycleDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CyclesService {
  constructor(private prisma: PrismaService) {}

  async createCycles(teamId: string): Promise<Cycle[]> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { preferences: true },
    });
    const preferences = team.preferences as TeamPreferenceDto;
    const cycleLength = (preferences.cyclesFrequency || 2) * 7;
    const numberOfCycles = preferences.upcomingCycles || 2;

    // Get the latest cycle number
    const latestCycle = await this.prisma.cycle.findFirst({
      where: { teamId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    let currentCycleNumber = (latestCycle?.number ?? 0) + 1;
    let currentStartDate = this.roundToNearest30Minutes(new Date());
    const cyclesData = [];

    // Create multiple cycles
    for (let i = 0; i < numberOfCycles + 1; i++) {
      const endDate = new Date(currentStartDate);
      endDate.setDate(endDate.getDate() + cycleLength);

      cyclesData.push({
        teamId,
        name: `Cycle ${currentCycleNumber}`,
        number: currentCycleNumber,
        startDate: currentStartDate,
        status: i === 0 ? CycleStatusEnum.CURRENT : CycleStatusEnum.UPCOMING,
        endDate,
        preferences: {},
      });

      // Prepare for next cycle
      currentCycleNumber++;
      currentStartDate = new Date(endDate);
    }

    // Create all cycles in a transaction
    const cycles = await this.prisma.$transaction(
      cyclesData.map((cycle) => this.prisma.cycle.create({ data: cycle })),
    );
    await this.prisma.team.update({
      where: { id: teamId },
      data: { currentCycle: 1 },
    });

    return cycles;
  }

  async updateCycleDates(
    cycleId: string,
    updateCycleDates: UpdateCycleDto,
  ): Promise<Cycle[]> {
    const {
      startDate: startDateStr,
      endDate: endDateStr,
      description,
    } = updateCycleDates;
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    const originalCycle = await this.prisma.cycle.findUnique({
      where: { id: cycleId },
      select: { teamId: true, number: true, startDate: true, endDate: true },
    });

    // If endDate not provided or hasn't changed, just update the current cycle
    if (!endDate || endDate.getTime() === originalCycle.endDate.getTime()) {
      const cycle = await this.prisma.cycle.update({
        where: { id: cycleId },
        data: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          description,
        },
      });
      return [cycle];
    }

    // Get subsequent cycles only if end date has changed
    const subsequentCycles = await this.prisma.cycle.findMany({
      where: {
        teamId: originalCycle.teamId,
        number: { gt: originalCycle.number },
      },
      orderBy: { number: 'asc' },
    });

    // Calculate the date difference
    const daysDifference = Math.floor(
      (endDate.getTime() - originalCycle.endDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Update all cycles in a transaction
    return this.prisma.$transaction([
      // Update the current cycle
      this.prisma.cycle.update({
        where: { id: cycleId },
        data: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          description,
        },
      }),
      // Update all subsequent cycles
      ...subsequentCycles.map((cycle) => {
        const newStartDate = new Date(cycle.startDate);
        newStartDate.setDate(newStartDate.getDate() + daysDifference);
        const newEndDate = new Date(cycle.endDate);
        newEndDate.setDate(newEndDate.getDate() + daysDifference);

        return this.prisma.cycle.update({
          where: { id: cycle.id },
          data: {
            startDate: newStartDate,
            endDate: newEndDate,
          },
        });
      }),
    ]);
  }

  roundToNearest30Minutes(date: Date): Date {
    const roundedDate = new Date(date);
    roundedDate.setMinutes(Math.ceil(roundedDate.getMinutes() / 30) * 30);
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    return roundedDate;
  }
}
