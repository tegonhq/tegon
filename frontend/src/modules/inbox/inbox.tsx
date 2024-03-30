/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { Header } from './header';

export function Inbox() {
  return (
    <main className="grid grid-cols-3 h-full">
      <div className="flex flex-col col-span-1">
        <Header />
      </div>
      <div className="border-l flex col-span-2 items-center justify-center"></div>
    </main>
  );
}

Inbox.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
