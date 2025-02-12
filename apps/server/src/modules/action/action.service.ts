import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  RoleEnum,
  CreateActionDto,
  ActionTrigger,
  ActionConfig,
  ActionStatusEnum,
  UpdateActionInputsDto,
  ActionTypesEnum,
  ActionScheduleStatusEnum,
  ActionScheduleDto,
  User,
} from '@tegonhq/types';
import { tasks } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';
import { actionRun } from 'trigger/action-run';
import { v4 as uuidv4 } from 'uuid';

import { prepareTriggerPayload } from 'modules/action-event/action-event.utils';
import { IntegrationsService } from 'modules/integrations/integrations.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export default class ActionService {
  constructor(
    private prisma: PrismaService, // Prisma service for database operations
    private triggerdev: TriggerdevService, // Service for interacting with TriggerDev
    private usersService: UsersService, // Service for managing users
    private integrationsService: IntegrationsService,
  ) {}

  async getAction(slug: string, workspaceId: string) {
    try {
      // Find the action by its slug
      const action = await this.prisma.action.findFirst({
        where: {
          slug,
          workspaceId,
        },
      });

      return action;
    } catch (e) {
      throw new NotFoundException('Action not found');
    }
  }

  // Update the inputs for an existing action
  async updateActionInputs(
    updateBodyDto: UpdateActionInputsDto,
    slug: string,
    workspaceId: string,
  ) {
    // Find the action by its slug
    const action = await this.getAction(slug, workspaceId);

    // Get the current data or initialize an empty object
    const currentData = action.data ? action.data : {};

    // Update the inputs in the data object
    const updateData = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(currentData as any),
      inputs: updateBodyDto.inputs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    // Update the action with the new data and set the status to ACTIVE
    return await this.prisma.action.update({
      where: {
        id: action.id,
      },
      data: {
        data: updateData,
        status: ActionStatusEnum.ACTIVE,
      },
    });
  }

  // Create a new action resource
  async createAction(
    actionCreateResource: CreateActionDto,
    workspaceId: string,
    userId: string,
  ) {
    const config = actionCreateResource.config;

    let workflowUser: User;
    // Use a transaction to ensure atomicity
    await this.prisma.$transaction(async (prisma) => {
      await this.checkIfActionCanBeDeployed(
        prisma,
        workspaceId,
        actionCreateResource.config.slug,
      );

      if (!actionCreateResource.isPersonal) {
        // Upsert a workflow user for the action
        workflowUser = await this.upsertWorkflowUser(
          prisma,
          config.name,
          config.slug,
          workspaceId,
          config.icon,
        );

        // Upsert the workflow user on the workspace
        await this.upsertUserOnWorkspace(prisma, workflowUser.id, workspaceId);
      }

      // Map triggers to entities
      const entities = this.mapTriggersToEntities(config.triggers);

      // Find or create the action
      const action = await this.findOrCreateAction(
        prisma,
        userId,
        workspaceId,
        config,
        actionCreateResource.version,
      );

      // Recreate the action entities
      await this.recreateActionEntities(prisma, action.id, entities);
    });

    if (workflowUser) {
      // Create a personal access token for the trigger
      await this.createPersonalTokenForTrigger(
        this.prisma,
        workflowUser.id,
        workspaceId,
      );
    }
  }

  private async checkIfActionCanBeDeployed(
    prisma: Partial<PrismaClient>,
    workspaceId: string,
    slug: string,
  ) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    const workspacePreferences = workspace.preferences as {
      actionCount: number;
    };

    const totalActionsDeployed = await prisma.action.findMany({
      where: {
        workspaceId,
      },
    });

    const alreadyCreatedAction = await prisma.action.findMany({
      where: {
        slug,
      },
    });

    if (
      workspace.actionsEnabled &&
      !alreadyCreatedAction &&
      totalActionsDeployed.length >= workspacePreferences.actionCount
    ) {
      throw new BadRequestException(
        'Total number of actions you can deploy is maxed',
      );
    }
  }

  // Create a personal access token for the trigger
  private async createPersonalTokenForTrigger(
    prisma: Partial<PrismaClient>,
    userId: string,
    workspaceId: string,
  ) {
    // Find an existing personal access token for the trigger
    const pat = await prisma.personalAccessToken.findFirst({
      where: {
        type: 'trigger',
        userId,
      },
    });

    // If no token exists, create a new one
    if (!pat) {
      await this.usersService.createPersonalAccessToken(
        'Trigger',
        userId,
        workspaceId,
        'trigger',
      );
    }
  }

  // Upsert a workflow user for the action
  private async upsertWorkflowUser(
    prisma: Partial<PrismaClient>,
    name: string,
    username: string,
    workspaceId: string,
    icon?: string,
  ) {
    const email = `${username}_${workspaceId}@tegon.ai`;
    return await prisma.user.upsert({
      where: { email },
      create: {
        id: uuidv4(),
        email,
        fullname: name,
        username,
        image: icon,
      },
      update: {
        image: icon,
        fullname: name,
      },
    });
  }

  // Upsert the workflow user on the workspace
  private async upsertUserOnWorkspace(
    prisma: Partial<PrismaClient>,
    userId: string,
    workspaceId: string,
  ) {
    const teamIds = (
      await prisma.team.findMany({
        where: { workspaceId },
      })
    ).map((team) => team.id);

    await prisma.usersOnWorkspaces.upsert({
      where: {
        userId_workspaceId: { workspaceId, userId },
      },
      update: { role: RoleEnum.BOT },
      create: { workspaceId, userId, role: RoleEnum.BOT, teamIds },
    });
  }

  // Map triggers to entities
  private mapTriggersToEntities(triggers: ActionTrigger[]) {
    return triggers
      .flatMap((trigger) => {
        if (trigger.entities && trigger.entities.length > 0) {
          return trigger.entities.map((entity) => ({
            type: trigger.type,
            entity,
          }));
        }

        return undefined;
      })
      .filter(Boolean);
  }

  // Find or create an action
  private async findOrCreateAction(
    prisma: Partial<PrismaClient>,
    userId: string,
    workspaceId: string,
    config: ActionConfig,
    version: string,
  ) {
    // Find an existing action by slug and workspace
    let action = await prisma.action.findFirst({
      where: { slug: config.slug, workspaceId },
    });

    // If no action exists, create a new one
    if (!action) {
      action = await prisma.action.create({
        data: {
          name: config.name,
          slug: config.slug,
          description: config.description,
          integrations: config.integrations ? config.integrations : [],
          createdById: userId,
          workspaceId,
          status: config.inputs
            ? ActionStatusEnum.NEEDS_CONFIGURATION
            : ActionStatusEnum.ACTIVE,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: config as any,
          version,
          url: config.url,
        },
      });
    } else {
      // If the action exists, update it
      action = await prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: config as any,
          name: action.name,
          integrations: config.integrations ? config.integrations : [],
          status: ActionStatusEnum.ACTIVE,
          deleted: null,
          url: config.url,
        },
      });
    }

    return action;
  }

  // Recreate the action entities
  private async recreateActionEntities(
    prisma: Partial<PrismaClient>,
    actionId: string,
    entities: Array<{ type: string; entity: string }>,
  ) {
    // Delete the current action entities
    await prisma.actionEntity.deleteMany({
      where: { actionId },
    });

    // Create new action entities
    await prisma.actionEntity.createMany({
      data: entities.map((entity) => ({
        ...entity,
        actionId,
      })),
    });
  }

  // Delete an action
  async delete(id: string) {
    // Find the action by name and workspace
    const action = await this.prisma.action.findUnique({
      where: { id },
    });

    if (action) {
      // Delete the action entities associated with the action
      await this.prisma.actionEntity.deleteMany({
        where: { actionId: action.id },
      });

      // Delete the action itself
      await this.prisma.action.update({
        where: { id: action.id },
        data: { deleted: new Date() },
      });
    }
  }

  // Get all actions for a workspace
  async getActions(workspaceId: string) {
    const actions = await this.prisma.action.findMany({
      where: {
        workspaceId,
      },
    });

    return actions;
  }

  async getInputsForSlug(slug: string, workspaceId: string) {
    // Find the action by slug and workspace
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
        workspaceId,
      },
    });

    const triggerPayload = await prepareTriggerPayload(
      this.prisma,
      this.integrationsService,
      action.id,
    );

    return await tasks.triggerAndPoll<typeof actionRun>('action-run', {
      workspaceId: action.workspaceId,
      payload: {
        event: ActionTypesEnum.GET_INPUTS,
        workspaceId,
        ...triggerPayload,
      },
    });
  }

  async createActionSchedule(
    slug: string,
    workspaceId: string,
    scheduleActionBody: ActionScheduleDto,
    scheduledById: string,
  ) {
    const prisma = this.prisma;
    return await prisma.$transaction(async (tx) => {
      const action = await tx.action.findFirst({
        where: { slug, workspaceId },
      });

      const actionSchedule = await tx.actionSchedule.create({
        data: {
          ...scheduleActionBody,
          status: ActionScheduleStatusEnum.IN_ACTIVE,
          scheduledById,
          action: { connect: { id: action.id } },
        },
      });

      try {
        const scheduleResponse = await this.triggerdev.createScheduleTask({
          cron: actionSchedule.cron,
          deduplicationKey: actionSchedule.id,
          externalId: actionSchedule.id,
          ...(actionSchedule.timezone
            ? { timezone: actionSchedule.timezone }
            : {}),
        });

        return await tx.actionSchedule.update({
          where: { id: actionSchedule.id },
          data: {
            status: ActionScheduleStatusEnum.ACTIVE,
            scheduleId: scheduleResponse.id,
          },
        });
      } catch (error) {
        // If createScheduleTask fails, the transaction will be rolled back automatically
        throw error;
      }
    });
  }

  async udpateActionSchedule(
    actionScheduleId: string,
    scheduleActionBody: ActionScheduleDto,
  ) {
    const prisma = this.prisma;
    return await prisma.$transaction(async (tx) => {
      const actionSchedule = await tx.actionSchedule.update({
        where: { id: actionScheduleId },
        data: scheduleActionBody,
        include: { action: true },
      });

      try {
        await this.triggerdev.updateScheduleTask(actionScheduleId, {
          cron: actionSchedule.cron,
          externalId: actionSchedule.id,
          ...(actionSchedule.timezone
            ? { timezone: actionSchedule.timezone }
            : {}),
        });

        return actionSchedule;
      } catch (error) {
        // If updateScheduleTask fails, the transaction will be rolled back automatically
        throw error;
      }
    });
  }

  async deleteActionSchedule(actionScheduleId: string) {
    const prisma = this.prisma;
    return await prisma.$transaction(async (tx) => {
      const actionSchedule = await tx.actionSchedule.update({
        where: { id: actionScheduleId },
        data: {
          deleted: new Date().toISOString(),
          status: ActionScheduleStatusEnum.IN_ACTIVE,
        },
        include: { action: true },
      });

      try {
        await this.triggerdev.updateScheduleTask(actionScheduleId, {
          cron: actionSchedule.cron,
          externalId: actionSchedule.id,
          ...(actionSchedule.timezone
            ? { timezone: actionSchedule.timezone }
            : {}),
        });

        return actionSchedule;
      } catch (error) {
        // If updateScheduleTask fails, the transaction will be rolled back automatically
        throw error;
      }
    });
  }

  async triggerActionEntity(actionId: string) {
    const action = await this.prisma.action.findUnique({
      where: { id: actionId },
    });

    const addedTaskInfo = await prepareTriggerPayload(
      this.prisma,
      this.integrationsService,
      action.id,
    );

    return await tasks.trigger<typeof actionRun>('action-run', {
      workspaceId: action.workspaceId,
      payload: {
        event: ActionTypesEnum.ON_SCHEDULE,
        ...addedTaskInfo,
      },
    });
  }
}
