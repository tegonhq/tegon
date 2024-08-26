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
import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

@Injectable()
export default class ActionService {
  constructor(
    private prisma: PrismaService,
    private triggerdev: TriggerdevService,
  ) {}

  async updateActionInputs(updateBodyDto: UpdateActionInputsDto, slug: string) {
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
      },
    });

    const currentData = action.data ? action.data : {};

    const updateData = {
      ...(currentData as JsonObject),
      inputs: updateBodyDto.inputs,
    } as JsonObject;

    return await this.prisma.action.update({
      where: {
        id: action.id,
      },
      data: {
        data: updateData,
      },
    });
  }

  async createResource(actionCreateResource: CreateActionDto, userId: string) {
    const config = actionCreateResource.config;
    const workspaceId = actionCreateResource.workspaceId;

    await this.prisma.$transaction(async (prisma) => {
      const workflowUser = await this.upsertWorkflowUser(
        prisma,
        config.name,
        workspaceId,
      );
      await this.upsertUserOnWorkspace(prisma, workflowUser.id, workspaceId);
      const entities = this.mapTriggersToEntities(config.triggers);
      const action = await this.findOrCreateAction(
        prisma,
        userId,
        workspaceId,
        config,
        actionCreateResource.version,
      );
      await this.recreateActionEntities(prisma, action.id, entities);
    });
  }

  private async upsertWorkflowUser(
    prisma: Partial<PrismaClient>,
    name: string,
    workspaceId: string,
  ) {
    const email = `${name}_${workspaceId}@tegon.ai`;
    return await prisma.user.upsert({
      where: { email },
      create: {
        id: uuidv4(),
        email,
        fullname: name,
        username: name,
      },
      update: {},
    });
  }

  private async upsertUserOnWorkspace(
    prisma: Partial<PrismaClient>,
    userId: string,
    workspaceId: string,
  ) {
    await prisma.usersOnWorkspaces.upsert({
      where: {
        userId_workspaceId: { workspaceId, userId },
      },
      update: { role: RoleEnum.BOT },
      create: { workspaceId, userId, role: RoleEnum.BOT },
    });
  }

  private mapTriggersToEntities(triggers: ActionTrigger[]) {
    return triggers.flatMap((trigger) =>
      trigger.entities.map((entity) => ({
        type: trigger.type,
        entity,
      })),
    );
  }

  private async findOrCreateAction(
    prisma: Partial<PrismaClient>,
    userId: string,
    workspaceId: string,
    config: ActionConfig,
    version: string,
  ) {
    let action = await prisma.action.findFirst({
      where: { name: config.name, workspaceId },
    });

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
          version,
        },
      });
    } else {
      action = await prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: config as any,
          integrations: config.integrations ? config.integrations : [],
          status: ActionStatusEnum.ACTIVE,
        },
      });
    }

    return action;
  }

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

  async delete(name: string, workspaceId: string) {
    // Delete action entities associated with the action
    const action = await this.prisma.action.findFirst({
      where: { name, workspaceId },
    });
    if (action) {
      await this.prisma.actionEntity.deleteMany({
        where: { actionId: action.id },
      });
      // Delete the action itself
      await this.prisma.action.delete({
        where: { id: action.id },
      });
    }
  }

  async getActions(workspaceId: string) {
    const actions = await this.prisma.action.findMany({
      where: {
        workspaceId,
      },
    });

    return actions;
  }

  async getExternalActions() {
    const actionsUrl =
      'https://raw.githubusercontent.com/tegonhq/tegon/main/actions/actions.json';
    const response = await axios.get(actionsUrl);
    const actions = response.data;
    return await Promise.all(
      actions.map(async (action: { slug: string }) => {
        const config = await this.getActionConfig(action.slug);
        return {
          ...action,
          config,
        };
      }),
    );
  }

  async getExternalActionWithSlug(slug: string) {
    const actionsUrl =
      'https://raw.githubusercontent.com/tegonhq/tegon/main/actions/actions.json';
    const response = await axios.get(actionsUrl);
    const actions = response.data;
    const action = actions.find(
      (action: { slug: string }) => action.slug === slug,
    );

    const config = await this.getActionConfig(action.slug);

    const description = await this.getActionReadme(slug);

    return { ...action, guide: description, config };
  }

  async getActionConfig(slug: string) {
    const actionsDir =
      'https://raw.githubusercontent.com/tegonhq/tegon/main/actions';
    const configUrl = `${actionsDir}/${slug}/config.json`;
    const response = await axios.get(configUrl);
    return response.data;
  }

  async getActionReadme(slug: string) {
    try {
      const actionsDir =
        'https://raw.githubusercontent.com/tegonhq/tegon/main/actions';
      const configUrl = `${actionsDir}/${slug}/README.md`;
      const response = await axios.get(configUrl);
      return response.data;
    } catch (e) {
      return undefined;
    }
  }

  async getRunsForSlug(slug: string) {
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
      },
    });

    return await this.triggerdev.getRunsForTask(action.workspaceId, slug);
  }

  async getRunForSlug(slug: string, runId: string) {
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
      },
    });

    return await this.triggerdev.getRun(action.workspaceId, runId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(slug: string, payload: any) {
    const action = await this.prisma.action.findFirst({
      where: {
        slug,
      },
    });

    await this.triggerdev.triggerTaskAsync(
      action.workspaceId,
      action.slug,
      payload,
    );
  }
}
