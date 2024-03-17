/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { TeamStoreInit } from 'store/team-store-provider';

import { FiltersView } from './filters-view';
import { Header } from './header';
import { ListView } from './list-view';

export const AllIssues = () => {
  return (
    <main className="flex flex-col">
      <Header />
      <FiltersView />
      <div className="grow overflow-y-auto h-[calc(100vh_-_55px)]">
        <ListView />
      </div>
    </main>
  );
};

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <TeamStoreInit>{page}</TeamStoreInit>
    </AppLayout>
  );
};
