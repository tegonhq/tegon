import { AppLayout } from 'common/layouts/app-layout';

import { Header } from './header';
import { ViewsList } from './views-list';

export function Views() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Views" />
      <div className="bg-background-2 rounded-tl-3xl flex flex-col h-[calc(100vh_-_53px)]">
        <ViewsList />
      </div>
    </main>
  );
}

Views.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
