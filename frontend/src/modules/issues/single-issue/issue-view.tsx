/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import type { WorkflowType } from 'common/types/team';
import { WorkflowCategoryEnum } from 'common/types/team';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';
import { useAllTeamWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';
import { IssueStoreInit } from 'store/issue-store-provider';

import { LeftSide } from './left-side/left-side';
import { RightSide } from './right-side/right-side';
import { TriageView } from './triage-view';

export const IssueView = () => {
  const currentTeam = useCurrentTeam();
  const workflows = useAllTeamWorkflows(currentTeam.identifier);
  const { applicationStore } = useContextStore();
  const triageWorkflow = workflows.find(
    (workflow: WorkflowType) =>
      workflow.category === WorkflowCategoryEnum.TRIAGE,
  );
  const issue = useIssueData();

  React.useEffect(() => {
    if (issue) {
      applicationStore.addToSelectedIssues(issue.id, true);
    }

    return () => {
      applicationStore.removeSelectedIssue(issue.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!issue) {
    return null;
  }

  if (issue.stateId === triageWorkflow.id) {
    return <TriageView />;
  }

  return (
    <IssueStoreInit>
      <main className="grid grid-cols-5 h-full">
        <div className="col-span-5 xl:col-span-4 flex flex-col h-[100vh]">
          <LeftSide />
        </div>
        <div className="bg-background border-l dark:bg-slate-800/50 hidden flex-col xl:flex">
          <RightSide />
        </div>
      </main>
    </IssueStoreInit>
  );
};
