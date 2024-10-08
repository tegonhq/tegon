import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';

import { Header } from './header';
import { ViewsList } from './views-list';

export function Views() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Views" />
      <ContentBox>
        <ViewsList />
      </ContentBox>
    </main>
  );
}

Views.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
