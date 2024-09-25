import { observer } from 'mobx-react-lite';

import { useFilterIssues } from 'modules/issues/issues-utils';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { TableC } from './table';

export const TableView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();

  const issues = issuesStore.getIssuesForTeam(
    team.id,
    applicationStore.displaySettings.showSubIssues,
  );

  const computedIssues = useFilterIssues(issues, team.id);

  return <TableC issues={computedIssues} />;
});
