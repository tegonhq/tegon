import { type IssueType, type TeamType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { getIssueRows } from '../../list-view-utils';
import { sort } from 'fast-sort';

export const useIssueRowsTeam = (issues: IssueType[], teams: TeamType[]) => {
  const {
    applicationStore: {
      displaySettings: { showEmptyGroups },
    },
    issuesStore,
    issueRelationsStore,
  } = useContextStore();

  return getIssueRows(
    issues,
    'teamId',
    sort(teams)
      .asc((team) => team.name)
      .map((team) => team.id),
    showEmptyGroups,
    issuesStore,
    issueRelationsStore,
  );
};
