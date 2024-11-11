import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useProjects } from 'hooks/projects';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { ProjectBoard } from './project-board';
import { ProjectList } from './project-list';

export const ProjectView = observer(() => {
  const {
    applicationStore: {
      displaySettings: { view },
    },
  } = useContextStore();
  const projects = useProjects();

  return view === ViewEnum.list ? (
    <ProjectList projects={projects} />
  ) : (
    <ProjectBoard projects={projects} />
  );
});
