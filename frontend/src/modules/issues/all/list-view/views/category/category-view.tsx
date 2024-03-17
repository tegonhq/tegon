/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import type { WorkflowType } from 'common/types/team';

import { useContextStore } from 'store/global-context-provider';

import { CategoryViewItem } from './category-view-item';

export const CategoryView = observer(() => {
  const {
    workflowsStore: { workflows },
  } = useContextStore();

  return (
    <div>
      {workflows.map((workflow: WorkflowType) => (
        <CategoryViewItem key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
});
