/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';

import { DisplayPopover } from './display-popover';
import { Header } from './header';
import { ListView } from './list-view';
import { SaveViewActions } from './save-view-actions';
import { FiltersView } from '../filters-view/filters-view';

export const AllIssues = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);

  return (
    <main className="flex flex-col h-[100vh] overflow-hidden">
      <Header title="All issues" />
      <FiltersView
        Actions={
          <>
            <DisplayPopover />
            <SaveViewActions />
          </>
        }
      />
      <div className="grow overflow-hidden">
        <ListView />
      </div>
    </main>
  );
});

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
