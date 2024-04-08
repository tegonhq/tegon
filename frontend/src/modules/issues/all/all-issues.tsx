/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { FiltersView } from './filters-view';
import { Header } from './header';
import { ListView } from './list-view';

export const AllIssues = () => {
  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="All issues" />
      <FiltersView />
      <div className="grow overflow-hidden">
        <ListView />
      </div>
    </main>
  );
};

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
