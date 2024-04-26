/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { Header } from './header';
import { ViewsList } from './views-list';

export function Views() {
  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="Views" />
      <ViewsList />
    </main>
  );
}

Views.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
