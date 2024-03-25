/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';

import { FiltersView } from './all/filters-view';
import { Header } from './all/header';
import { ListView } from './all/list-view';

export const ActiveIssues = () => {
  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="Active Issues" />
      <FiltersView />
      <div className="grow overflow-y-auto">
        <ListView />
      </div>
    </main>
  );
};

ActiveIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
