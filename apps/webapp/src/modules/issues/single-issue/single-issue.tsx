import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';

import { IssueView } from './issue-view';

export function SingleIssue() {
  useScope(SCOPES.AllIssues);
  useScope(SCOPES.SingleIssues);

  return <IssueView />;
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
