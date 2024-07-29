import { WorkflowCategoryEnum, type WorkflowType } from '@tegonhq/types';
import { TriageFill } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { WorkflowColors } from 'common/status-color';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

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
      <TriageFill size={32} color={WorkflowColors.Triage.color} />
      <div className="text-muted-foreground text-sm">
        {issues.length} issues to triage
      </div>
    </div>
  );
});
