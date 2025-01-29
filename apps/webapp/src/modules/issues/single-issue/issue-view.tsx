import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { MainLayout } from 'common/layouts/main-layout';
import { SCOPES } from 'common/scopes';

import { IssueViewContext } from 'components/side-issue-view';
import { IssueDataContext, useIssueDataFromStore } from 'hooks/issues';
import { useTeamWithId } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';
import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from './header';
import { LeftSideSupport } from './left-side';
import { LeftSide } from './left-side/left-side';
import { RightSide } from './right-side/right-side';

const getComponent = (teamType: string) => {
  if (teamType === 'support') {
    return LeftSideSupport;
  }

  return LeftSide;
};

interface IssueViewProps {
  sideView?: boolean;
}

export const IssueView = observer(({ sideView = false }: IssueViewProps) => {
  const { applicationStore } = useContextStore();
  const router = useRouter();
  const { issueId, closeIssueView } = React.useContext(IssueViewContext);

  const issue = useIssueDataFromStore(sideView);
  const team = useTeamWithId(issue?.teamId);

  React.useEffect(() => {
    if (issue && !sideView) {
      applicationStore.addToSelectedIssues(issue.id, true);
    }

    return () => {
      applicationStore.removeSelectedIssue(issue?.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useHotkeys(
    Key.Escape,
    (e) => {
      if (issueId) {
        closeIssueView();
      } else {
        router.back();
      }
      e.preventDefault();
    },
    { scopes: [SCOPES.SingleIssues], enabled: !issueId },
  );

  if (!issue) {
    return null;
  }

  const Component = getComponent(team.preferences.teamType);

  return (
    <IssueDataContext.Provider value={{ issue }}>
      <MainLayout header={<Header sideView={sideView} />}>
        <IssueStoreInit sideView={sideView}>
          <main className="flex h-[calc(100vh_-_62px)]">
            <div className="grow flex flex-col h-[calc(100vh_-_62px)]">
              <Component />
            </div>
            <div className="shrink-0 border-l border-border flex-col flex w-[280px] h-[calc(100vh_-_62px)]">
              <RightSide />
            </div>
          </main>
        </IssueStoreInit>
      </MainLayout>
    </IssueDataContext.Provider>
  );
});
