import { type IssueType, type ProjectType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { getIssueRows } from '../../list-view-utils';

export const useIssueRowsProject = (
  issues: IssueType[],
  projects: ProjectType[],
) => {
  const {
    applicationStore: {
      displaySettings: { showEmptyGroups },
    },
    issuesStore,
    issueRelationsStore,
  } = useContextStore();

  return getIssueRows(
    issues,
    'projectId',
    projects.map((project) => project.id),
    showEmptyGroups,
    issuesStore,
    issueRelationsStore,
  );
};
