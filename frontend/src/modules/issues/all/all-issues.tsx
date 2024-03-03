/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { TeamStoreProvider } from 'common/wrappers/team-store-provider';
import { AppLayout } from 'layouts/app-layout';

import { Header } from './header';
import { ListView } from './list-view';

export function AllIssues() {
  return (
    <main className="flex flex-col">
      <Header />
      <div className="grow">
        <ListView />
      </div>
    </main>
  );
}

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <TeamStoreProvider>{page}</TeamStoreProvider>
    </AppLayout>
  );
};
