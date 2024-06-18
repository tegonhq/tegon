/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';
import { TriageLineCircle } from 'icons';

import { useContextStore } from 'store/global-context-provider';

export const RightSide = observer(() => {
  const currentTeam = useCurrentTeam();
  const { issuesStore } = useContextStore();
  const workflows = useTeamWorkflows(currentTeam.identifier);
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );
  const issues = issuesStore.getIssuesForState(
    triageWorkflow.id,
    currentTeam.id,
    false,
  );

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-2">
      <TriageLineCircle className="text-muted-foreground" size={32} />
      <div className="text-muted-foreground text-sm">
        {issues.length} issues to triage
      </div>
    </div>
  );
});
