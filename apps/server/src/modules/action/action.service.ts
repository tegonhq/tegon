import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  RoleEnum,
  CreateActionDto,
  ActionTrigger,
  ActionConfig,
  ActionStatusEnum,
  UpdateActionInputsDto,
  JsonObject,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import { prepareTriggerPayload } from 'modules/action-event/action-event.utils';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export default class ActionService {
  constructor(
    private prisma: PrismaService, // Prisma service for database operations
    private triggerdev: TriggerdevService, // Service for interacting with TriggerDev
    private usersService: UsersService, // Service for managing users
  ) {}

  // Update the inputs for an existing action
  async updateActionInputs(updateBodyDto: UpdateActionInputsDto, slug: string) {
    // Find the action by its slug
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
      },
    });

    // Get the current data or initialize an empty object
    const currentData = action.data ? action.data : {};

    // Update the inputs in the data object
    const updateData = {
      ...(currentData as JsonObject),
      inputs: updateBodyDto.inputs,
    } as JsonObject;

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
  async createResource(actionCreateResource: CreateActionDto, userId: string) {
    const config = actionCreateResource.config;
    const workspaceId = actionCreateResource.workspaceId;

    // Use a transaction to ensure atomicity
    await this.prisma.$transaction(async (prisma) => {
      // Upsert a workflow user for the action
      const workflowUser = await this.upsertWorkflowUser(
        prisma,
        config.name,
        config.slug,
        workspaceId,
      );

      // Create a personal access token for the trigger
      await this.createPersonalTokenForTrigger(prisma, workflowUser.id);

      // Upsert the workflow user on the workspace
      await this.upsertUserOnWorkspace(prisma, workflowUser.id, workspaceId);

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
  }

  // Create a personal access token for the trigger
  private async createPersonalTokenForTrigger(
    prisma: Partial<PrismaClient>,
    userId: string,
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
      await this.usersService.createPersonalAcccessToken(
        'Trigger',
        userId,
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
  ) {
    const email = `${name}_${workspaceId}@tegon.ai`;
    return await prisma.user.upsert({
      where: { email },
      create: {
        id: uuidv4(),
        email,
        fullname: name,
        username,
      },
      update: {},
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
    return triggers.flatMap((trigger) =>
      trigger.entities.map((entity) => ({
        type: trigger.type,
        entity,
      })),
    );
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

    // Get the latest version for the task
    const latestVersion = await this.triggerdev.getLatestVersionForTask(
      config.slug,
    );

    // If no action exists, create a new one
    if (!action) {
      action = await prisma.action.create({
        data: {
          name: config.name,
          slug: config.slug,
          integrations: config.integrations ? config.integrations : [],
          createdById: userId,
          workspaceId,
          status: config.inputs
            ? ActionStatusEnum.NEEDS_CONFIGURATION
            : ActionStatusEnum.ACTIVE,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: config as any,
          triggerVersion: latestVersion,
          version,
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
  async delete(name: string, workspaceId: string) {
    // Find the action by name and workspace
    const action = await this.prisma.action.findFirst({
      where: { name, workspaceId },
    });

    if (action) {
      // Delete the action entities associated with the action
      await this.prisma.actionEntity.deleteMany({
        where: { actionId: action.id },
      });

      // Delete the action itself
      await this.prisma.action.delete({
        where: { id: action.id },
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

  // Get runs for a specific action slug
  async getRunsForSlug(workspaceId: string, slug: string) {
    // Find the action by slug and workspace
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
        workspaceId,
      },
    });

    // Get runs for the action from TriggerDev
    return await this.triggerdev.getRunsForTask(action.workspaceId, slug);
  }

  // Get a specific run for an action slug
  async getRunForSlug(workspaceId: string, slug: string, runId: string) {
    // Find the action by slug and workspace
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
        workspaceId,
      },
    });

    // Get the run from TriggerDev
    return await this.triggerdev.getRun(action.workspaceId, runId);
  }

  // Run an action with a payload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(workspaceId: string, slug: string, payload: any) {
    // Find the action by slug and workspace
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
        workspaceId,
      },
    });

    // Prepare the trigger payload
    const addedTaskInfo = await prepareTriggerPayload(this.prisma, action.id);

    // Trigger the task asynchronously with the payload and added task info
    await this.triggerdev.triggerTaskAsync(
      action.workspaceId,
      action.slug,
      {
        ...payload,
        ...addedTaskInfo,
      },
      { lockToVersion: action.triggerVersion },
    );
  }
}
