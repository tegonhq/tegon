import { observer } from 'mobx-react-lite';

import { useFilterIssues } from 'modules/issues/issues-utils';

import { useContextStore } from 'store/global-context-provider';

import { TableC } from './table';

interface TableView {
  teamId?: string;
}

export const TableView = observer(({ teamId }: TableView) => {
  const { issuesStore, applicationStore } = useContextStore();

  const issues = teamId
    ? issuesStore.getIssuesForTeam(
        teamId,
        applicationStore.displaySettings.showSubIssues,
      )
    : issuesStore.getIssues();

  const computedIssues = useFilterIssues(issues, teamId);

  return <TableC issues={computedIssues} />;
});
