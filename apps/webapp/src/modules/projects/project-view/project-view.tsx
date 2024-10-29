import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useProject } from 'hooks/projects';

import { ProjectIssues } from './issues';
import { Overview } from './overview';
import { RightSide } from './overview/right-side';
import { Header } from '../header';

export const ProjectView = withApplicationStore(() => {
  const [view, setView] = React.useState('overview');
  const project = useProject();

  if (!project) {
    return <h2>No project found</h2>;
  }

  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Projects" isProjectView view={view} setView={setView} />
      <ContentBox>
        <main className="grid grid-cols-5 h-[calc(100vh_-_53px)]">
          <div className="col-span-4 flex flex-col h-[calc(100vh_-_55px)]">
            {view === 'overview' && <Overview />}
            {view === 'issues' && <ProjectIssues />}
          </div>
          <div className="border-l border-border flex-col flex">
            <RightSide />
          </div>
        </main>
      </ContentBox>
    </main>
  );
});

ProjectView.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
