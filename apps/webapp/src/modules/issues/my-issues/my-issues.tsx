import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Header } from './my-issues-header';
import { IssuesViewOptions } from '../all/issues-view-options';
import { ListView } from '../all/list-view';
import { FiltersView } from '../filters-view/filters-view';

export const MyIssues = withApplicationStore(() => {
  return (
    <main className="flex flex-col overflow-hidden h-[100vh]">
      <Header />

      <ContentBox>
        <FiltersView Actions={<IssuesViewOptions />} />
        <ListView />
      </ContentBox>
    </main>
  );
});

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
