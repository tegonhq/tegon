/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { IssueStoreInit } from 'store/issue-store-provider';

import { LeftSide } from './left-side/left-side';
import { RightSide } from './right-side/right-side';

export function SingleIssue() {
  return (
    <main className="grid grid-cols-4 h-full">
      <LeftSide />
      <RightSide />
    </main>
  );
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <IssueStoreInit>{page}</IssueStoreInit>
    </AppLayout>
  );
};
