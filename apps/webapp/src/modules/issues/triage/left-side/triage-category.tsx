import { Button } from '@tegonhq/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import { ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import ReactTimeAgo from 'react-time-ago';

import type { IssueType } from 'common/types';
import type { User } from 'common/types';
import { getUserData } from 'common/user-util';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { getCreatedBy } from './triage-utils';

interface TriageCategoryProps {
  issues: IssueType[];
  labelId: string;
  usersData: User[];
}

export const TriageCategory = observer(
  ({ labelId, issues, usersData }: TriageCategoryProps) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const currentTeam = useCurrentTeam();
    const { labelsStore } = useContextStore();
    const label = labelsStore.getLabelWithId(labelId);
    const {
      query: { issueId, workspaceSlug },
      push,
    } = useRouter();

    if (issues.length === 0) {
      return null;
    }

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-1 h-full"
      >
        <div className="flex gap-1 items-center">
          <CollapsibleTrigger asChild>
            <Button
              size="lg"
              className="flex group items-center ml-6 w-fit rounded-2xl bg-grayAlpha-100 px-4"
              variant="ghost"
            >
              <div>
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <h3 className="pl-1">{label.name}</h3>
            </Button>
          </CollapsibleTrigger>
          <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
            {issues.length}
          </div>
        </div>

        <CollapsibleContent>
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
                  'ml-4 p-2 py-0 mr-4 hover:bg-grayAlpha-300 rounded mb-1',
                  issueId === `${currentTeam.identifier}-${issue.number}` &&
                    'bg-grayAlpha-300',
                )}
                onClick={() => {
                  push(
                    `/${workspaceSlug}/issue/${currentTeam.identifier}-${issue.number}`,
                  );
                }}
              >
                <div
                  className={cn(
                    'flex flex-col gap-1 py-2',
                    !noBorder && 'border-b border-border',
                  )}
                >
                  <div className="flex justify-between text-sm">
                    <div className="w-[calc(100%_-_70px)]">
                      <div className="truncate">{issue.title}</div>
                    </div>
                    <div className="text-muted-foreground w-[70px] text-right">{`${currentTeam.identifier}-${issue.number}`}</div>
                  </div>

                  <div className="flex justify-between text-sm">
                    {getCreatedBy(userData)}
                    <div className="text-muted-foreground text-xs">
                      <ReactTimeAgo date={new Date(issue.updatedAt)} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  },
);
