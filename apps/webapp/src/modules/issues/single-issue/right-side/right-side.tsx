import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';

import {
  DueDate,
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssueLabelDropdown,
  IssueLabelDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';
import {
  ProjectDropdown,
  ProjectDropdownVariant,
  ProjectMilestoneDropdown,
  ProjectMilestoneDropdownVariant,
} from 'modules/issues/components/issue-metadata/project';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { IssueRelatedProperties } from './issue-related-properties';

export const RightSide = observer(() => {
  const issue = useIssueData();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { projectsStore } = useContextStore();
  const team = useCurrentTeam();
  const hasProjectsForTeam = projectsStore.hasProjects(team.id);
  const statusChange = (stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  const labelsChange = (labelIds: string[]) => {
    updateIssue({ id: issue.id, labelIds, teamId: issue.teamId });
  };

  const projectChange = (projectId: string) => {
    updateIssue({
      id: issue.id,
      projectId,
      projectMilestoneId: null,
      teamId: issue.teamId,
    });
  };

  const projectMielstoneChange = (projectMilestoneId: string) => {
    updateIssue({ id: issue.id, projectMilestoneId, teamId: issue.teamId });
  };

  const priorityChange = (priority: number) => {
    updateIssue({
      id: issue.id,
      priority,
      teamId: issue.teamId,
    });
  };

  const dueDateChange = (dueDate: Date) => {
    updateIssue({
      id: issue.id,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      teamId: issue.teamId,
    });
  };

  return (
    <div className="grow p-6 flex flex-col gap-4">
      <div className="flex flex-col items-start">
        <label className="text-xs">Status</label>
        <IssueStatusDropdown
          value={issue.stateId}
          onChange={statusChange}
          variant={IssueStatusDropdownVariant.LINK}
          teamIdentifier={team.identifier}
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-xs">Priority</label>

        <IssuePriorityDropdown
          value={issue.priority ?? 0}
          onChange={priorityChange}
          variant={IssuePriorityDropdownVariant.LINK}
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-xs">Assignee</label>

        <IssueAssigneeDropdown
          value={issue.assigneeId}
          onChange={assigneeChange}
          variant={IssueAssigneeDropdownVariant.LINK}
        />
      </div>

      <IssueRelatedProperties />

      <div className={cn('flex flex-col justify-start items-start gap-1')}>
        <div className="text-xs text-left">Labels</div>

        <IssueLabelDropdown
          value={issue.labelIds}
          onChange={labelsChange}
          variant={IssueLabelDropdownVariant.LINK}
          teamIdentifier={team.identifier}
        />
      </div>
      <div className={cn('flex flex-col justify-start items-start gap-1')}>
        <div className="text-xs text-left">Due Date</div>
        <DueDate dueDate={issue.dueDate} dueDateChange={dueDateChange} />
      </div>

      {hasProjectsForTeam && (
        <div className={cn('flex flex-col justify-start items-start gap-1')}>
          <div className="text-xs text-left">Project</div>

          <ProjectDropdown
            value={issue.projectId}
            onChange={projectChange}
            variant={ProjectDropdownVariant.LINK}
            teamIdentifier={team.identifier}
          />
        </div>
      )}
      {issue.projectId && (
        <div className={cn('flex flex-col justify-start items-start gap-1')}>
          <div className="text-xs text-left">Project Milestone</div>

          <ProjectMilestoneDropdown
            value={issue.projectMilestoneId}
            onChange={projectMielstoneChange}
            variant={ProjectMilestoneDropdownVariant.LINK}
            teamIdentifier={team.identifier}
            projectId={issue.projectId}
          />
        </div>
      )}
    </div>
  );
});
