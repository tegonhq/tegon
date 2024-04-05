/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';

// import { Header } from '../all/header';
import { ScrollArea } from 'components/ui/scroll-area';

import { Header } from './my-issues-header';
import { MyIssuesView } from './my-issues-view';
import { FiltersView } from '../all/filters-view';

export function MyIssues() {
  return (
    <main className="flex flex-col overflow-hidden h-[100vh]">
      <Header />
      <FiltersView />
      <ScrollArea className="grow">
        <MyIssuesView />
      </ScrollArea>
    </main>
  );
}

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
