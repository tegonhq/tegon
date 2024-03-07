/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';
import { TeamStoreProvider } from 'common/wrappers/team-store-provider';

import { LeftSide } from './left-side/left-side';

export function SingleIssue() {
  return (
    <main className="grid grid-cols-3 h-full">
      <LeftSide />

      <div className="bg-gray-100 dark:bg-gray-800/50"></div>
    </main>
  );
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <TeamStoreProvider>{page}</TeamStoreProvider>
    </AppLayout>
  );
};
