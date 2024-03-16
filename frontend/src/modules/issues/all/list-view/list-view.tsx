/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import type { WorkflowType } from 'common/types/team';

import { useContextStore } from 'store/global-context-provider';

import { IssuesCategory } from './issues-category';

export const ListView = observer(() => {
  const {
    workflowsStore: { workflows },
  } = useContextStore();

  return (
    <div>
      {workflows.map((workflow: WorkflowType) => (
        <IssuesCategory key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
});
