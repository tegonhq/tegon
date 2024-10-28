import { observer } from 'mobx-react-lite';

import { useFilterIssues } from 'modules/issues/issues-utils';

import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { TableC } from './table';

export const TableView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const { workflows } = useComputedWorkflows();

  const issues = team
    ? issuesStore.getIssuesForTeam(
        team.id,
        applicationStore.displaySettings.showSubIssues,
      )
    : issuesStore.getIssues();

  const computedIssues = useFilterIssues(issues, workflows);

  return <TableC issues={computedIssues} />;
});
