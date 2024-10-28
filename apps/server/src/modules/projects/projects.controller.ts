import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  CreateProjectDto,
  CreateProjectMilestoneDto,
  ProjectMilestoneRequestParamsDto,
  ProjectRequestParamsDto,
  UpdateProjectDto,
  UpdateProjectMilestoneDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Workspace } from 'modules/auth/session.decorator';

import { ProjectsService } from './projects.service';

@Controller({
  version: '1',
  path: 'projects',
})
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProject(
    @Workspace() workspace: string,
    @Body() projectData: CreateProjectDto,
  ) {
    return await this.projects.createProject(projectData, workspace);
  }

  @Post('milestone/:projectMilestoneId')
  @UseGuards(AuthGuard)
  async updateProjectMilestone(
    @Param() projectMilestoneParams: ProjectMilestoneRequestParamsDto,
    @Body() projectData: UpdateProjectMilestoneDto,
  ) {
    return await this.projects.updateProjectMilestone(
      projectData,
      projectMilestoneParams.projectMilestoneId,
    );
  }

  @Post(':projectId/milestone')
  @UseGuards(AuthGuard)
  async createProjectMilestone(
    @Param() projectParams: ProjectRequestParamsDto,
    @Body() projectMilestoneData: CreateProjectMilestoneDto,
  ) {
    return await this.projects.createProjectMilestone(
      projectMilestoneData,
      projectParams.projectId,
    );
  }

  @Post(':projectId')
  @UseGuards(AuthGuard)
  async updateProject(
    @Param() projectParams: ProjectRequestParamsDto,
    @Body() projectData: UpdateProjectDto,
  ) {
    return await this.projects.updateProject(
      projectData,
      projectParams.projectId,
    );
  }
}
