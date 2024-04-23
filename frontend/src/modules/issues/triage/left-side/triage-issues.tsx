/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import { sort } from 'fast-sort';
import { useRouter } from 'next/router';
import ReactTimeAgo from 'react-time-ago';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';
import type { IssueSourceMetadataType, IssueType } from 'common/types/issue';
import { Integration } from 'common/types/linked-issue';
import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';
import { getUserData } from 'common/user-util';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { ScrollArea } from 'components/ui/scroll-area';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';
import { useAllTeamWorkflows } from 'hooks/workflows';
import { SlackIcon } from 'icons';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

export function getCreatedBy(issue: IssueType, user: User) {
  const sourceMetadata = issue.sourceMetadata
    ? (JSON.parse(issue.sourceMetadata) as IssueSourceMetadataType)
    : undefined;

  if (sourceMetadata) {
    if (sourceMetadata.type === Integration.Slack) {
      return (
        <div className="flex gap-2 text-muted-foreground items-center">
          <SlackIcon size={14} />
          Slack
        </div>
      );
    }

    if (sourceMetadata.type === Integration.Github) {
      return (
        <div className="flex gap-2 text-muted-foreground items-center">
          <RiGithubFill size={16} />
          Github
        </div>
      );
    }
  }

  return (
    <div className="flex gap-2 text-muted-foreground items-center">
      <Avatar className="h-[15px] w-[20px] flex items-center">
        <AvatarImage />
        <AvatarFallback
          className={cn(
            'text-[0.55rem] rounded-sm',
            getTailwindColor(user.username),
          )}
        >
          {getInitials(user.fullname)}
        </AvatarFallback>
      </Avatar>
      {user.username}
    </div>
  );
}

export const TriageIssues = () => {
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
  ).desc((issue: IssueType) => new Date(issue.updatedAt));

  if (isLoading) {
    return null;
  }

  return (
    <ScrollArea className="overflow-y-auto h-[calc(100vh_-_50px)]">
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
                'p-4 py-2 flex flex-col gap-1',
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
                  <div className="truncate font-medium">{issue.title}</div>
                </div>
                <div className="text-muted-foreground w-[70px] text-right">{`${currentTeam.identifier}-${issue.number}`}</div>
              </div>

              <div className="flex justify-between text-sm">
                {getCreatedBy(issue, userData)}
                <div className="text-muted-foreground text-xs">
                  <ReactTimeAgo date={new Date(issue.updatedAt)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
