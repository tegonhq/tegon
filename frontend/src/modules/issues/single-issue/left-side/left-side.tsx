/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { NewIssue } from 'modules/issues/new-issue/new-issue';

import { Separator } from 'components/ui/separator';
import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { FilterSmall } from './filters-small';
import { Header } from './header';
import { IssueActivity } from './issue-activity';
import { IssueDescription } from './issue-description';
import { IssueTitle } from './issue-title';
import { LinkedIssuesView } from './linked-issues-view';
import { ParentIssueView } from './parent-issue-view';
import { SubIssueView } from './sub-issue-view';

export const LeftSide = observer(() => {
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

  const onIssueChange = useDebouncedCallback((content: string) => {
    updateIssue({
      title: content,
      teamId: issue.teamId,
      id: issue.id,
    });
  }, 1000);

  return (
    <>
      <Header />
      <div className="flex xl:hidden px-8 py-2 border-b">
        <FilterSmall />
      </div>
      <div className="grow px-8 py-6 flex flex-col gap-2 overflow-y-auto">
        <div>
          {issue.parentId && <ParentIssueView issue={issue} />}

          <IssueTitle value={issue.title} onChange={onIssueChange} />
          <IssueDescription
            value={issue.description}
            onChange={onDescriptionChange}
          />

          <SubIssueView
            childIssues={issue.children}
            setNewIssueState={() => setNewIssueState(true)}
            newIssueState={newIssueState}
          />
        </div>

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

        <LinkedIssuesView issueId={issue.id} />

        <Separator className="my-1" />

        <IssueActivity />
      </div>
    </>
  );
});
