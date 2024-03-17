/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import type { UsersOnWorkspaceType } from 'common/types/workspace';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeViewItem, NoAssigneeView } from './assignee-view-item';

export const AssigneeView = observer(() => {
  const {
    workspaceStore: { usersOnWorkspaces },
  } = useContextStore();

  return (
    <div>
      {usersOnWorkspaces.map((uOW: UsersOnWorkspaceType) => (
        <AssigneeViewItem key={uOW.id} userOnWorkspace={uOW} />
      ))}
      <NoAssigneeView />
    </div>
  );
});
