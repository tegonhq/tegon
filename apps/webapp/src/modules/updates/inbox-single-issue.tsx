import type React from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@tegonhq/ui/components/resizable';

import { LeftSide } from 'modules/issues/single-issue/left-side/left-side';
import { RightSide } from 'modules/issues/single-issue/right-side/right-side';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';

import { IssueDataContext, useIssueDataFromStore } from 'hooks/issues';

import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from './header';
import { NotificationsList } from './notifications-list';

export function InboxSingleIssue() {
  const issue = useIssueDataFromStore(false);

  return (
    <IssueDataContext.Provider value={{ issue }}>
      <main className="flex flex-col h-[100vh]">
        <Header />
        <ContentBox>
          <ResizablePanelGroup direction="horizontal" className="">
            <ResizablePanel
              maxSize={50}
              defaultSize={24}
              minSize={16}
              collapsible
              collapsedSize={16}
            >
              <div className="flex flex-col h-full">
                <h2 className="text-lg pl-4 pt-4 font-medium"> Inbox </h2>
                <NotificationsList />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel collapsible collapsedSize={0}>
              <div className="flex">
                <div className="flex flex-col h-full w-full">
                  <main className="grid grid-cols-4 h-full">
                    <div className="col-span-4 xl:col-span-3 flex flex-col h-[calc(100vh_-_52px)]">
                      <LeftSide />
                    </div>
                    <div className="border-l border-border hidden flex-col xl:col-span-1 xl:flex">
                      <RightSide />
                    </div>
                  </main>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ContentBox>
      </main>
    </IssueDataContext.Provider>
  );
}

InboxSingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <IssueStoreInit sideView={false}>{page}</IssueStoreInit>
    </AppLayout>
  );
};
