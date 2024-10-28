import { Injectable } from '@nestjs/common';
import {
  CreateProjectDto,
  CreateProjectMilestoneDto,
  UpdateProjectDto,
  UpdateProjectMilestoneDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

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
}
