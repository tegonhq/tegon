/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import type { WorkflowType } from 'common/types/team';
import { WorkflowCategoryEnum } from 'common/types/team';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';
import { useAllTeamWorkflows } from 'hooks/workflows';

import { LeftSide } from './left-side/left-side';
import { RightSide } from './right-side/right-side';
import { TriageView } from './triage-view';

export const IssueView = observer(() => {
  const currentTeam = useCurrentTeam();
  const workflows = useAllTeamWorkflows(currentTeam.identifier);
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );
  const issue = useIssueData();

  if (issue.stateId === triageWorkflow.id) {
    return <TriageView />;
  }

  return (
    <main className="grid grid-cols-5 h-full">
      <div className="col-span-5 xl:col-span-4 flex flex-col h-[100vh]">
        <LeftSide />
      </div>
      <div className="bg-background border-l dark:bg-slate-800/50 hidden flex-col xl:flex">
        <RightSide />
      </div>
    </main>
  );
});
