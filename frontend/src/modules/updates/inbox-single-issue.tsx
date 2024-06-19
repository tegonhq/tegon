/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { LeftSide } from 'modules/issues/single-issue/left-side/left-side';
import { RightSide } from 'modules/issues/single-issue/right-side/right-side';

import { AppLayout } from 'common/layouts/app-layout';

import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from './header';
import { NotificationsList } from './notifications-list';

export function InboxSingleIssue() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header />
      <div className="bg-gray-200 rounded-tl-2xl flex h-[calc(100vh_-_53px)]">
        <div className="flex flex-col">
          <NotificationsList />
        </div>
        <div className="border-l flex">
          <div className="flex flex-col h-full w-full">
            <main className="grid grid-cols-4 h-full">
              <div className="col-span-4 xl:col-span-3 flex flex-col h-[calc(100vh_-_52px)]">
                <LeftSide />
              </div>
              <div className="border-l hidden flex-col xl:col-span-1 xl:flex">
                <RightSide />
              </div>
            </main>
          </div>
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
