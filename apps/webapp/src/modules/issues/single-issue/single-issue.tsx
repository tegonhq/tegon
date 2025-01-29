import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';

import { IssueViewContext } from 'components/side-issue-view';
import { useScope } from 'hooks';

import { IssueView } from './issue-view';

export function SingleIssue() {
  useScope(SCOPES.AllIssues);
  useScope(SCOPES.SingleIssues);
  const { closeIssueView } = React.useContext(IssueViewContext);

  React.useEffect(() => {
    return () => {
      closeIssueView();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <IssueView />;
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
