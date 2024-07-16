import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';

import { Header } from './header';
import { IssuesViewOptions } from './issues-view-options';
import { ListView } from './list-view';
import { FiltersView } from '../filters-view/filters-view';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="All issues" />
      <div className="bg-background-2 rounded-tl-3xl flex flex-col h-[calc(100vh_-_53px)]">
        <FiltersView Actions={<IssuesViewOptions />} />
        <ListView />
      </div>
    </main>
  );
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
