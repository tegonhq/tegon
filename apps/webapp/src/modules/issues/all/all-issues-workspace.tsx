import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';

import { Header } from './header';
import { IssuesViewOptions } from './issues-view-options-workspace';
import { TableView } from './list-view/views/table-view';
import { FiltersView } from '../filters-view/filters-view';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="All issues" />
      <ContentBox>
        <FiltersView Actions={<IssuesViewOptions />} />
        <TableView />
      </ContentBox>
    </main>
  );
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
