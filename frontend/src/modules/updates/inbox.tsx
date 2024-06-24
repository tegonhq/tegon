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
        <div className="flex flex-col w-[400px]">
          <h2 className="text-lg pl-6 pt-6 font-medium"> Inbox </h2>
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
