/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Header } from './all/header';
import { ListView } from './all/list-view';
import { FiltersView } from './filters-view/filters-view';

export const BacklogIssues = withApplicationStore(() => {
  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="Backlog" />
      <FiltersView showStatus={false} />
      <div className="grow overflow-y-auto">
        <ListView />
      </div>
    </main>
  );
});

BacklogIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
