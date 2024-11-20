import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Header } from './header';
import { IssuesViewOptions } from '../all/issues-view-options';
import { ListView } from '../all/list-view';
import { FiltersView } from '../filters-view/filters-view';

export const MyIssues = withApplicationStore(() => {
  return (
    <MainLayout header={<Header />} className="overflow-hidden">
      <ContentBox>
        <FiltersView Actions={<IssuesViewOptions />} />
        <ListView />
      </ContentBox>
    </MainLayout>
  );
});

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
