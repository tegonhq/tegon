import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { getWorkflowColor } from 'common/status-color';
import { type IssueHistoryType } from 'common/types';
import { getWorkflowIcon } from 'common/workflow-icons';

import { useTeamWithId } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

interface StatusActivityProps {
  issueHistory: IssueHistoryType;
  fullname: string;
  showTime?: boolean;
  teamId: string;
}
export const StatusActivity = observer(
  ({
    issueHistory,
    fullname,
    showTime = false,
    teamId,
  }: StatusActivityProps) => {
    const team = useTeamWithId(teamId);
    const workflows = useTeamWorkflows(team.identifier);

    const fromWorkflow = workflows.find(
      (workflow) => workflow.id === issueHistory.fromStateId,
    );

    const toWorkflow = workflows.find(
      (workflow) => workflow.id === issueHistory.toStateId,
    );

    const CategoryIcon = getWorkflowIcon(toWorkflow);

    return (
      <TimelineItem
        key={`${issueHistory.id}-removedLabels`}
        hasMore
        date={showTime && issueHistory.updatedAt}
      >
        <div className="flex items-cente text-muted-foreground">
          <CategoryIcon
            size={20}
            className="mr-2"
            color={getWorkflowColor(toWorkflow).color}
          />

          <div className="flex items-center">
            {fromWorkflow ? (
              <>
                <span className="text-foreground mr-2">{fullname}</span>
                changed status from
                <span className="text-foreground mx-2">
                  {fromWorkflow.name}
                </span>
                <span> to </span>
              </>
            ) : (
              <>
                <span className="text-foreground mr-2">{fullname}</span>
                changed status
                <span className="ml-1"> to </span>
              </>
            )}

            <span className="text-foreground mx-2">{toWorkflow?.name}</span>
          </div>
        </div>
      </TimelineItem>
    );
  },
);
