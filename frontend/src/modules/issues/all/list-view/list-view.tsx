/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeView } from './views/assignee';
import { CategoryView } from './views/category';
import { LabelView } from './views/label';
import { PriorityView } from './views/priority';

export const ListView = observer(() => {
  const { applicationStore } = useContextStore();
  const grouping = applicationStore.displaySettings.grouping;

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
