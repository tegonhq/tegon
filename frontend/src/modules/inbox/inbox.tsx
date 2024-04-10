/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { Header } from './header';
import { NotificationsList } from './notifications-list';
import { NotificationRightSide } from './right-side';

export function Inbox() {
  return (
    <main className="grid grid-cols-4 h-full">
      <div className="flex flex-col col-span-1 overflow-hidden">
        <Header />
        <NotificationsList />
      </div>
      <NotificationRightSide />
    </main>
  );
}

Inbox.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
