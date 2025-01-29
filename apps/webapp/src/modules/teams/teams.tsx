import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { MainLayout } from 'common/layouts/main-layout';
import { SCOPES } from 'common/scopes';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useScope } from 'hooks';

import { Header } from './header';
import { TeamsList } from './teams-list/teams-list';
// import { ProjectsList } from './projects-list';

export const Teams = withApplicationStore(() => {
  useScope(SCOPES.AllIssues);

  return (
    <MainLayout header={<Header title="Teams" />}>
      <TeamsList />
    </MainLayout>
  );
});

Teams.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
