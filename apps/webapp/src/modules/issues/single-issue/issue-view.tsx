import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';
import { SCOPES } from 'common/scopes';

import { useIssueData } from 'hooks/issues';
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

export const IssueView = observer(() => {
  const { applicationStore } = useContextStore();
  const router = useRouter();

  const issue = useIssueData();
  const team = useTeamWithId(issue?.teamId);

  React.useEffect(() => {
    if (issue) {
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
      router.back();
      e.preventDefault();
    },
    { scopes: [SCOPES.SingleIssues] },
  );

  if (!issue) {
    return null;
  }

  const Component = getComponent(team.preferences.teamType);

  return (
    <IssueStoreInit>
      <MainLayout header={<Header />}>
        <ContentBox>
          <main className="flex h-[calc(100vh_-_53px)]">
            <div className="grow flex flex-col h-[calc(100vh_-_55px)]">
              <Component />
            </div>
            <div className="border-l border-border flex-col flex w-[280px]">
              <RightSide />
            </div>
          </main>
        </ContentBox>
      </MainLayout>
    </IssueStoreInit>
  );
});
