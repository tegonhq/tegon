/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { AppLayout } from 'common/layouts/app-layout';

// import { Header } from '../all/header';
import { Header } from './my-issues-header';
import { MyIssuesView } from './my-issues-view';

export function MyIssues() {
  return (
    <main className="flex flex-col">
      <Header />
      {/* <FiltersView /> */}
      <div className="grow">
        <MyIssuesView />
      </div>
    </main>
  );
}

MyIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
