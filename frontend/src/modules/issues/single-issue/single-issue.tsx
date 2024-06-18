/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';

import { IssueView } from './issue-view';

export function SingleIssue() {
  useScope(SCOPES.AllIssues);

  return <IssueView />;
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
