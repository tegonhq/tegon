import { observer } from 'mobx-react-lite';

import { useFilterIssues } from 'modules/issues/issues-utils';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { TableC } from './table';

export const TableView = observer(() => {
  const { issuesStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();
  const { workflows } = useComputedWorkflows();

  const issues = issuesStore.getIssues({
    projectId: project?.id,
    teamId: team?.id,
  });

  const computedIssues = useFilterIssues(issues, workflows);

  return <TableC issues={computedIssues} />;
});
