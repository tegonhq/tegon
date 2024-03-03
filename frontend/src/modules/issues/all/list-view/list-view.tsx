/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { useTeamIssues } from 'common/hooks/use-team-issues';
import { useTeamWorkflows } from 'common/hooks/use-team-workflows';
import { IssueType } from 'common/types/issue';

import { IssuesCategory } from './issues-category';

export const ListView = observer(() => {
  const workflows = useTeamWorkflows();
  const issues = useTeamIssues();

  return (
    <div>
      {workflows.map((workflow) => (
        <IssuesCategory
          key={workflow.id}
          workflow={workflow}
          issues={issues.filter(
            (issue: IssueType) => issue.stateId === workflow.id,
          )}
        />
      ))}
    </div>
  );
});
