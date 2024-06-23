/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IssueType } from 'common/types/issue';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

import { IssueListItem } from '../components';
import { useFilterIssues } from '../issues-utils';

export const MyIssuesView = observer(() => {
  const user = React.useContext(UserContext);
  const { issuesStore } = useContextStore();
  const issues = useFilterIssues(
    issuesStore.getIssuesForUser(true, { userId: user.id }),
    undefined,
  );

  return (
    <div className="flex flex-col h-full">
      {issues.map((issue: IssueType) => (
        <IssueListItem key={issue.id} issueId={issue.id} />
      ))}
    </div>
  );
});
