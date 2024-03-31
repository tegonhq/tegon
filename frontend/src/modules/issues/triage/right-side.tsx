/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { useCurrentTeam } from 'hooks/teams';
import { useAllTeamWorkflows } from 'hooks/workflows';
import { TriageFill } from 'icons';

import { useContextStore } from 'store/global-context-provider';

export const RightSide = observer(() => {
  const currentTeam = useCurrentTeam();
  const { issuesStore } = useContextStore();
  const workflows = useAllTeamWorkflows(currentTeam.identifier);
  const triageWorkflow = workflows[0];
  const issues = issuesStore.getIssuesForState(
    triageWorkflow.id,
    currentTeam.id,
    false,
  );

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-2">
      <TriageFill className="text-muted-foreground" size={32} />
      <div className="text-muted-foreground text-sm">
        {issues.length} issues to triage
      </div>
    </div>
  );
});
