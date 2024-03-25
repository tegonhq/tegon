/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { IssueStoreInit } from 'store/issue-store-provider';

import { IssueView } from './issue-view';

export function SingleIssue() {
  return <IssueView />;
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <IssueStoreInit>{page}</IssueStoreInit>
    </AppLayout>
  );
};
