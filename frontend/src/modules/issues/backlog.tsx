/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';

import { DisplayPopover } from './all/display-popover';
import { Header } from './all/header';
import { ListView } from './all/list-view';
import { SaveViewActions } from './all/save-view-actions';
import { FiltersView } from './filters-view/filters-view';

export const BacklogIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);

  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="Backlog" />
      <FiltersView
        showStatus={false}
        Actions={
          <>
            <DisplayPopover />
            <SaveViewActions />
          </>
        }
      />
      <div className="grow overflow-y-auto">
        <ListView />
      </div>
    </main>
  );
});

BacklogIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
