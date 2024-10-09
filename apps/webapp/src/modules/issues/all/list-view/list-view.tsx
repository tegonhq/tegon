import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useCurrentTeam } from 'hooks/teams';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { AssigneeView } from './views/assignee';
import { CategoryView } from './views/category';
import { LabelView } from './views/label';
import { PriorityView } from './views/priority';
import { TableView } from './views/table-view';

export const ListView = observer(() => {
  const { applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const {
    displaySettings: { view },
  } = applicationStore;
  const grouping = applicationStore.displaySettings.grouping;

  if (!team) {
    return <TableView />;
  }

  if (view === ViewEnum.sheet) {
    return <TableView teamId={team.id} />;
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

  return <CategoryView />;
});
