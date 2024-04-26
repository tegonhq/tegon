/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { LeftSide } from 'modules/issues/single-issue/left-side/left-side';
import { RightSide } from 'modules/issues/single-issue/right-side/right-side';

import { AppLayout } from 'common/layouts/app-layout';

import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from './header';
import { NotificationsList } from './notifications-list';

export function InboxSingleIssue() {
  return (
    <main className="grid grid-cols-4 h-full">
      <div className="border-l flex flex-col col-span-1">
        <Header />
        <NotificationsList />
      </div>
      <div className="border-l flex col-span-3">
        <div className="flex flex-col h-full w-full">
          <main className="grid grid-cols-4 h-full">
            <div className="col-span-4 xl:col-span-3 flex flex-col h-[calc(100vh_-_52px)]">
              <LeftSide />
            </div>
            <div className="bg-background border-l dark:bg-slate-800/50 hidden flex-col xl:col-span-1 xl:flex">
              <RightSide />
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}

InboxSingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <IssueStoreInit>{page}</IssueStoreInit>
    </AppLayout>
  );
};
