import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { AssigneeBoard } from './assignee-board';
import { AssigneeList } from './assignee-list';

export const AssigneeView = observer(() => {
  const {
    workspaceStore: { usersOnWorkspaces },
    applicationStore: {
      displaySettings: { view },
    },
  } = useContextStore();

  return view === ViewEnum.list ? (
    <AssigneeList usersOnWorkspaces={usersOnWorkspaces} />
  ) : (
    <AssigneeBoard usersOnWorkspaces={usersOnWorkspaces} />
  );
});
