/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { Header } from './header';
import { NotificationsList } from './notifications-list';
import { NotificationRightSide } from './right-side';

export function Inbox() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header />
      <div className="bg-gray-200 rounded-tl-3xl flex h-[calc(100vh_-_53px)]">
        <div className="flex flex-col col-span-1 overflow-hidden">
          <NotificationsList />
        </div>
        <NotificationRightSide />
      </div>
    </main>
  );
}

Inbox.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
