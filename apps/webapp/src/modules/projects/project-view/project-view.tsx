import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { Overview } from './overview';
import { Header } from '../header';

export const ProjectView = withApplicationStore(() => {
  const [view, setView] = React.useState('overview');

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Projects" isProjectView />
      <ContentBox>{view === 'overview' && <Overview />}</ContentBox>
    </main>
  );
});

ProjectView.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
