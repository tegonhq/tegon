/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { Header } from './header';
import { ViewsList } from './views-list';

export function Views() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Views" />
      <div className="bg-gray-200 rounded-tl-2xl flex flex-col h-[calc(100vh_-_53px)]">
        <ViewsList />
      </div>
    </main>
  );
}

Views.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
