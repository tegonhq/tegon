/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import type { IssueType } from 'common/types/issue';

import { useTeamIssues } from 'hooks/issues/use-team-issues';
import { useApplicationStore } from 'hooks/use-application-store';
import { useTeamWorkflows } from 'hooks/workflows/use-team-workflows';

import { IssuesCategory } from './issues-category';
import { filterIssues } from './list-view-utils';

export const ListView = observer(() => {
  const {
    query: { teamIdentifier },
  } = useRouter();
  const workflows = useTeamWorkflows(teamIdentifier as string);
  const applicationStore = useApplicationStore();
  const issues = useTeamIssues();

  const computedIssues = React.useMemo(() => {
    return filterIssues(issues, applicationStore.filters);
  }, [issues, applicationStore.filters]);

  return (
    <div>
      {workflows.map((workflow) => (
        <IssuesCategory
          key={workflow.id}
          workflow={workflow}
          issues={computedIssues.filter(
            (issue: IssueType) => issue.stateId === workflow.id,
          )}
        />
      ))}
    </div>
  );
});
