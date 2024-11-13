import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useUsersData } from 'hooks/users';

import { ViewEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

import { AssigneeBoard } from './assignee-board';
import { AssigneeList } from './assignee-list';

export const AssigneeView = observer(() => {
  const {
    applicationStore: {
      displaySettings: { view },
    },
  } = useContextStore();
  const { users, isLoading } = useUsersData(false);

  if (isLoading) {
    return null;
  }

  return view === ViewEnum.list ? (
    <AssigneeList users={users} />
  ) : (
    <AssigneeBoard users={users} />
  );
});
