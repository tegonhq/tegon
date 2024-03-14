/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { NewIssue } from 'modules/issues/new-issue/new-issue';

import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { Header } from './header';
import { IssueActivity } from './issue-activity';
import { IssueDescription } from './issue-description';
import { IssueTitle } from './issue-title';

export function LeftSide() {
  const issue = useIssueData();
  const team = useCurrentTeam();
  const [newIssueState, setNewIssueState] = React.useState(false);

  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const onDescriptionChange = useDebouncedCallback((content: string) => {
    updateIssue({
      description: content,
      teamId: issue.teamId,
      id: issue.id,
    });
  }, 1000);

  return (
    <div className="col-span-2">
      <Header />
      <div className="grow px-8 py-6 flex flex-col gap-4 overflow-y-auto h-[calc(100vh_-_52px)]">
        <div>
          {issue.parentId && (
            <div className="max-w-[400px] mb-1 border-1 bg-background backdrop-blur-md dark:bg-gray-700/20 shadow-2xl p-2 rounded-md flex gap-2 text-sm">
              <div className="text-muted-foreground">
                {team.identifier}-{issue.parent.number}
              </div>

              <div className="font-medium max-w-[400px]">
                <div className="truncate">{issue.parent.title}</div>
              </div>
            </div>
          )}

          <IssueTitle defaultValue={issue.title} />
          <IssueDescription
            value={issue.description}
            onChange={onDescriptionChange}
          />
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground -ml-4"
              onClick={() => setNewIssueState(true)}
              disabled={newIssueState}
            >
              + Add sub-issues
            </Button>
          </div>
        </div>

        <Separator className="my-1" />

        {newIssueState && (
          <>
            <div className="my-1">
              <NewIssue
                onClose={() => setNewIssueState(false)}
                teamIdentfier={team.identifier}
                parentId={issue.id}
              />
            </div>
            <Separator className="my-1" />
          </>
        )}

        <IssueActivity />
      </div>
    </div>
  );
}
