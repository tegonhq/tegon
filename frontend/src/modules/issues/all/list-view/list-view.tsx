/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeView } from './views/assignee';
import { CategoryView } from './views/category';
import { PriorityView } from './views/priority';

const VIEW_MAP = {
  status: CategoryView,
  assignee: AssigneeView,
  priority: PriorityView,
};

export const ListView = observer(() => {
  const { applicationStore } = useContextStore();
  const grouping = applicationStore.displaySettings.grouping;

  const ViewComponent = VIEW_MAP[grouping as keyof typeof VIEW_MAP];

  return (
    <div>
      <ViewComponent />
    </div>
  );
});
