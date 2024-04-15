/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { sort } from 'fast-sort';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import ReactTimeAgo from 'react-time-ago';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';
import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';
import { getUserData } from 'common/user-util';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';
import { useAllTeamWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

export const TriageIssues = observer(() => {
  const currentTeam = useCurrentTeam();
  const { issuesStore } = useContextStore();
  const workflows = useAllTeamWorkflows(currentTeam.identifier);
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );
  const { usersData, isLoading } = useUsersData();
  const {
    query: { issueId, workspaceSlug },

    push,
  } = useRouter();

  const issues = sort(
    issuesStore.getIssuesForState(triageWorkflow.id, currentTeam.id, false),
  ).desc((issue: IssueType) => issue.updatedAt);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col p-2">
      {issues.map((issue: IssueType, index: number) => {
        const nextIssue = issues[index + 1] as IssueType;
        const noBorder =
          (nextIssue &&
            issueId === `${currentTeam.identifier}-${nextIssue.number}`) ||
          issueId === `${currentTeam.identifier}-${issue.number}`;
        const userData = getUserData(usersData, issue.createdById);

        return (
          <div
            key={issue.id}
            className={cn(
              'p-4 py-2 flex flex-col gap-2',
              issueId === `${currentTeam.identifier}-${issue.number}` &&
                'bg-active rounded-md',
              !noBorder && 'border-b',
            )}
            onClick={() => {
              push(
                `/${workspaceSlug}/issue/${currentTeam.identifier}-${issue.number}`,
              );
            }}
          >
            <div className="flex justify-between text-sm">
              <div className="w-[calc(100%_-_70px)]">
                <div className="truncate">{issue.title}</div>
              </div>
              <div className="text-muted-foreground w-[70px] text-right">{`${currentTeam.identifier}-${issue.number}`}</div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex gap-2 text-muted-foreground items-center">
                <Avatar className="h-[15px] w-[20px] flex items-center">
                  <AvatarImage />
                  <AvatarFallback
                    className={cn(
                      'text-[0.6rem] rounded-sm',
                      getTailwindColor(userData.username),
                    )}
                  >
                    {getInitials(userData.fullname)}
                  </AvatarFallback>
                </Avatar>
                {userData.username}
              </div>

              <div className="text-muted-foreground text-xs">
                <ReactTimeAgo date={new Date(issue.updatedAt)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
