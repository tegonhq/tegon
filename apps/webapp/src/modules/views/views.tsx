import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';

import { Header } from './header';
import { ViewsList } from './views-list';

export function Views() {
  return (
    <MainLayout header={<Header title="Views" />}>
      <ContentBox>
        <ViewsList />
      </ContentBox>
    </MainLayout>
  );
}

Views.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
