import { observer } from 'mobx-react-lite';
import React from 'react';

import { AppLayout } from 'common/layouts/app-layout';
import { ContentBox } from 'common/layouts/content-box';
import { MainLayout } from 'common/layouts/main-layout';
import { withApplicationStore } from 'common/wrappers/with-application-store';

import { useProject } from 'hooks/projects';
import { useLocalState } from 'hooks/use-local-state';

import { ProjectIssues } from './issues';
import { Overview } from './overview';
import { RightSide } from './overview/right-side';
import { ProjectProgress } from './project-progress';
import { Header } from '../header';

export const Project = observer(({ view }: { view: 'overview' | 'issues' }) => {
  const project = useProject();

  if (!project) {
    return <h2>No project found</h2>;
  }

  return (
    <main className="grid grid-cols-5 h-[calc(100vh_-_53px)]">
      <div className="col-span-4 flex flex-col h-[calc(100vh_-_55px)]">
        <ProjectProgress id={project.id} />
        {view === 'overview' && <Overview />}
        {view === 'issues' && <ProjectIssues />}
      </div>
      <div className="border-l border-border flex-col flex">
        <RightSide />
      </div>
    </main>
  );
});

export const ProjectView = withApplicationStore(() => {
  const [view, setView] = useLocalState<'overview' | 'issues'>(
    'project_tab',
    'overview',
  );

  return (
    <MainLayout
      header={
        <Header title="Projects" isProjectView view={view} setView={setView} />
      }
    >
      <ContentBox>
        <Project view={view} />
      </ContentBox>
    </MainLayout>
  );
});

ProjectView.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
