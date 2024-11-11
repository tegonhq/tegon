import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { AssigneeView } from './views/assignee';
import { CategoryView } from './views/category';
import { LabelView } from './views/label';
import { PriorityView } from './views/priority';
import { ProjectView } from './views/projects';
import { TableView } from './views/table-view';
import { TeamView } from './views/team';

export const ListView = observer(() => {
  const { applicationStore } = useContextStore();

  const {
    displaySettings: { view },
  } = applicationStore;
  const grouping = applicationStore.displaySettings.grouping;

  if (view === ViewEnum.sheet) {
    return <TableView />;
  }

  if (grouping === 'assignee') {
    return <AssigneeView />;
  }

  if (grouping === 'priority') {
    return <PriorityView />;
  }

  if (grouping === 'label') {
    return <LabelView />;
  }

  if (grouping === 'project') {
    return <ProjectView />;
  }

  if (grouping === 'team') {
    return <TeamView />;
  }

  return <CategoryView />;
});
