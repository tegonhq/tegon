/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import { type IssueHistoryType } from 'common/types/issue';

import { TimelineItem } from 'components/ui/timeline';
import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

interface StatusActivityProps {
  issueHistory: IssueHistoryType;
  username: string;
  showTime?: boolean;
}
export const StatusActivity = observer(
  ({ issueHistory, username, showTime = false }: StatusActivityProps) => {
    const currentTeam = useCurrentTeam();
    const workflows = useTeamWorkflows(currentTeam.identifier);

    const fromWorkflow = workflows.find(
      (workflow) => workflow.id === issueHistory.fromStateId,
    );

    const toWorkflow = workflows.find(
      (workflow) => workflow.id === issueHistory.toStateId,
    );

    const CategoryIcon = WORKFLOW_CATEGORY_ICONS[toWorkflow.name];

    return (
      <TimelineItem key={`${issueHistory.id}-removedLabels`} hasMore>
        <div className="flex items-center text-xs text-muted-foreground">
          <div className="h-[15px] w-[20px] flex items-center justify-center mr-4">
            <CategoryIcon
              size={16}
              className="text-muted-foreground"
              color={toWorkflow.color}
            />
          </div>

          <div className="flex items-center">
            {fromWorkflow ? (
              <>
                <span className="text-foreground mr-2 font-medium">
                  {username}
                </span>
                changed status from
                <span className="text-foreground mx-2 font-medium">
                  {fromWorkflow.name}
                </span>
                <span> to </span>
              </>
            ) : (
              <>
                <span className="text-foreground mr-2 font-medium">
                  {username}
                </span>
                changed status
                <span className="ml-1"> to </span>
              </>
            )}

            <span className="text-foreground mx-2 font-medium">
              {toWorkflow.name}
            </span>
          </div>

          {showTime && (
            <>
              <div className="mx-1">-</div>
              <div>
                <ReactTimeAgo date={new Date(issueHistory.updatedAt)} />
              </div>
            </>
          )}
        </div>
      </TimelineItem>
    );
  },
);
