import { WorkflowCategory } from '@tegonhq/types';
import { Progress } from '@tegonhq/ui/components/progress';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IssueType, WorkflowType } from 'common/types';

import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

interface ProjectProgressProps {
  id: string;
  onlyGraph?: boolean;
}

export const ProjectProgress = observer(
  ({ id, onlyGraph = false }: ProjectProgressProps) => {
    const { issuesStore, projectsStore } = useContextStore();
    const project = projectsStore.getProjectWithId(id);
    const { workflows } = useComputedWorkflows();
    const issues = issuesStore.getIssuesForProject({ projectId: project?.id });

    if (!project) {
      return null;
    }

    const totalCompletedIssues = issues.filter((issue: IssueType) => {
      const workflow = workflows.find((workflow: WorkflowType) =>
        workflow.ids.includes(issue.stateId),
      );

      if (
        workflow.category === WorkflowCategory.COMPLETED ||
        workflow.category === WorkflowCategory.CANCELED
      ) {
        return true;
      }

      return false;
    });

    const startedIssues = React.useMemo(() => {
      return issues.filter((issue: IssueType) => {
        const workflow = workflows.find((workflow: WorkflowType) =>
          workflow.ids.includes(issue.stateId),
        );

        if (workflow.category === WorkflowCategory.STARTED) {
          return true;
        }

        return false;
      });
    }, [issues, workflows]);

    const completedPercentage =
      issues.length === 0
        ? 0
        : Math.floor((totalCompletedIssues.length / issues.length) * 100);
    const startedPercentage =
      issues.length === 0
        ? 0
        : Math.floor((startedIssues.length / issues.length) * 100);

    const color = React.useCallback((percentage: number) => {
      if (percentage > 80) {
        return '#3caf20';
      } else if (percentage > 30) {
        return '#c28c11';
      }
      return '#d94b0e';
    }, []);

    if (onlyGraph) {
      return (
        <div className="flex items-center gap-2">
          <Progress
            color={color(completedPercentage)}
            segments={[
              {
                value: completedPercentage + startedPercentage,
              },
              { value: completedPercentage },
            ]}
          />
          <div className="font-mono"> {completedPercentage}%</div>
        </div>
      );
    }

    return (
      <div className="pt-4 px-4 pb-0 flex w-full gap-10">
        <div className="flex flex-col grow gap-1">
          <h2>Project Progress</h2>
          <Progress
            color={color(completedPercentage)}
            segments={[
              {
                value: completedPercentage + startedPercentage,
              },
              { value: completedPercentage },
            ]}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-mono">Scope</h2>
          <p>{issues.length} issues </p>
        </div>
        <div className="flex flex-col">
          <h2 className="font-mono">Started</h2>
          <p>
            {startedPercentage}% ({startedIssues.length} issues)
          </p>
        </div>
        <div className="flex flex-col">
          <h2 className="font-mono">Done</h2>
          <p>
            {completedPercentage}% ({totalCompletedIssues.length} issues)
          </p>
        </div>
      </div>
    );
  },
);
