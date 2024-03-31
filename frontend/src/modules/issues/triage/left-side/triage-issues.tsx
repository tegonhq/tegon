/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import ReactTimeAgo from 'react-time-ago';

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

  const issues = issuesStore.getIssuesForState(
    triageWorkflow.id,
    currentTeam.id,
    false,
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col p-2">
      {issues.map((issue: IssueType, index: number) => {
        const nextIssue = issues[index + 1];
        const noBorder =
          (nextIssue &&
            issueId === `${currentTeam.identifier}-${nextIssue.number}`) ||
          issueId === `${currentTeam.identifier}-${issue.number}`;
        const userData = getUserData(usersData, issue.createdById);

        return (
          <div
            key={issue.id}
            className={cn(
              'p-4 py-3 flex flex-col gap-2',
              issueId === `${currentTeam.identifier}-${issue.number}` &&
                'bg-primary/10 rounded-md',
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
              <div className="flex gap-2 text-muted-foreground">
                <Avatar className="h-[20px] w-[25px] flex items-center">
                  <AvatarImage />
                  <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm">
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
