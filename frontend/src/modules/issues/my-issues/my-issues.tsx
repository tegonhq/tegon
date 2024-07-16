import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';

// import { Header } from '../all/header';
import { ScrollArea } from 'components/ui/scroll-area';

import { Header } from './my-issues-header';
import { MyIssuesView } from './my-issues-view';

export function MyIssues() {
  return (
    <main className="flex flex-col overflow-hidden h-[100vh]">
      <Header />

      <ScrollArea className="grow">
        <MyIssuesView />
      </ScrollArea>
    </main>
  );
}

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
