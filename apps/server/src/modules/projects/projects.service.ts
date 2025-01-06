import { Injectable } from '@nestjs/common';
import {
  CreateProjectDto,
  CreateProjectMilestoneDto,
  UpdateProjectDto,
  UpdateProjectMilestoneDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import IssuesService from 'modules/issues/issues.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private issuesService: IssuesService,
  ) {}

  async getProjects(workspaceId: string) {
    return await this.prisma.project.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async createProject(createProjectDto: CreateProjectDto, workspaceId: string) {
    return await this.prisma.project.create({
      data: {
        ...createProjectDto,
        workspace: { connect: { id: workspaceId } },
      },
    });
  }

  async updateProject(updateProjectDto: UpdateProjectDto, projectId: string) {
    return await this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
    });
  }

  async createProjectMilestone(
    createProjectMilestoneDto: CreateProjectMilestoneDto,
    projectId: string,
  ) {
    return await this.prisma.projectMilestone.create({
      data: {
        ...createProjectMilestoneDto,
        project: { connect: { id: projectId } },
      },
    });
  }

  async updateProjectMilestone(
    updateProjectMilestoneDto: UpdateProjectMilestoneDto,
    projectMilestoneId: string,
  ) {
    return await this.prisma.projectMilestone.update({
      where: { id: projectMilestoneId },
      data: updateProjectMilestoneDto,
    });
  }

  async deleteProject(projectId: string) {
    // Get all affected issues before deletion
    const affectedIssues = await this.prisma.issue.findMany({
      where: { projectId },
      include: { team: true },
    });

    // Mark all associated milestones as deleted
    await this.prisma.projectMilestone.updateMany({
      where: { projectId },
      data: { deleted: new Date().toISOString() },
    });

    // Update each affected issue through IssuesService
    await Promise.all(
      affectedIssues.map((issue) =>
        this.issuesService.updateIssueApi(
          { teamId: issue.teamId },
          { projectId: null, projectMilestoneId: null },
          { issueId: issue.id },
          'system',
        ),
      ),
    );

    // Finally mark the project as deleted
    return await this.prisma.project.update({
      where: { id: projectId },
      data: { deleted: new Date().toISOString() },
    });
  }

  async deleteProjectMilestone(projectMilestoneId: string) {
    // Get all affected issues before deletion
    const affectedIssues = await this.prisma.issue.findMany({
      where: { projectMilestoneId },
      include: { team: true },
    });

    // Update each affected issue through IssuesService
    await Promise.all(
      affectedIssues.map((issue) =>
        this.issuesService.updateIssueApi(
          { teamId: issue.teamId },
          { projectMilestoneId: null },
          { issueId: issue.id },
          'system',
        ),
      ),
    );

    // Mark the milestone as deleted
    return await this.prisma.projectMilestone.update({
      where: { id: projectMilestoneId },
      data: { deleted: new Date().toISOString() },
    });
  }
}
