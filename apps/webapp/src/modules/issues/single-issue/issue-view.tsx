import { WorkflowCategoryEnum } from '@tegonhq/types';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ContentBox } from 'common/layouts/content-box';
import type { WorkflowType } from 'common/types';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';
import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from './header';
import { LeftSide } from './left-side/left-side';
import { RightSide } from './right-side/right-side';
import { TriageView } from './triage-view';

export const IssueView = observer(() => {
  const currentTeam = useCurrentTeam();
  const workflows = useTeamWorkflows(currentTeam.identifier);
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
      applicationStore.removeSelectedIssue(issue?.id);
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
      <div className="flex flex-col h-[100vh]">
        <Header />
        <ContentBox>
          <main className="grid grid-cols-5 h-[calc(100vh_-_53px)]">
            <div className="col-span-4 flex flex-col h-[calc(100vh_-_55px)]">
              <LeftSide />
            </div>
            <div className="border-l border-border flex-col flex">
              <RightSide />
            </div>
          </main>
        </ContentBox>
      </div>
    </IssueStoreInit>
  );
});
