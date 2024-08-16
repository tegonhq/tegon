import { execSync } from 'child_process';

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RoleEnum } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid';

import { generateKeyForUserId } from 'common/authentication';

import {
  ActionCreateResource,
  ActionDeployDto,
  Trigger,
} from './action.interface';
import { createTempDir } from './action.utils';

@Injectable()
export default class ActionService {
  constructor(private prisma: PrismaService) {}

  async deploy(userId: string, actionBody: ActionDeployDto) {
    const { githubRepoUrl, workspaceId } = actionBody;
    const tempDirPath = await createTempDir();
    const token = await generateKeyForUserId(userId);

    // First command: Initialize the project with `tegon` CLI
    execSync(`npx @tegon/cli init -r ${githubRepoUrl} -d ${tempDirPath}`, {
      stdio: 'inherit',
    });

    // Extract folder name from the GitHub repo URL
    const repoName = githubRepoUrl
      .split('/')
      .pop()
      .replace(/\.git$/, '');
    const projectDirPath = `${tempDirPath}/${repoName}`;

    // Change into the directory where the project was cloned
    process.chdir(projectDirPath);

    // Second command: Deploy the project with `tegon` CLI
    execSync(`npx @tegon/cli deploy`, {
      env: {
        TOKEN: token,
        WORKSPACE_ID: workspaceId,
      },
      stdio: 'inherit',
    });
  }

  async createResource(
    actionCreateResource: ActionCreateResource,
    userId: string,
  ) {
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
        config.name,
        config.integrations,
        userId,
        workspaceId,
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

  private mapTriggersToEntities(triggers: Trigger[]) {
    return triggers.flatMap((trigger) =>
      trigger.entities.map((entity) => ({
        type: trigger.type,
        entity,
      })),
    );
  }

  private async findOrCreateAction(
    prisma: Partial<PrismaClient>,
    name: string,
    integrations: string[],
    userId: string,
    workspaceId: string,
  ) {
    let action = await prisma.action.findFirst({
      where: { name, workspaceId },
    });

    if (!action) {
      action = await prisma.action.create({
        data: {
          name,
          integrations: integrations ? integrations : [],
          createdById: userId,
          workspaceId,
        },
      });
    } else {
      action = await prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          integrations: integrations ? integrations : [],
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
    await prisma.actionEntity.deleteMany({
      where: { actionId },
    });

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

  async getProjectRuns() {
    // Get project runs from trigger.dev
  }

  getSingleRun() {
    // Get single run details
  }
}
