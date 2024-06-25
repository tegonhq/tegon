/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import { SCOPES } from 'common/scopes';

import { useShortcutHotKeys } from 'hooks';

import { AssigneeDialog, LabelDialog, StatusDialog } from './dialogs';
import { PriorityDialog } from './dialogs/priority-dialog';

interface State {
  status: boolean;
  assignee: boolean;
  label: boolean;
  priority: boolean;
  filter: boolean;
}

export const defaultState: State = {
  status: false,
  assignee: false,
  label: false,
  priority: false,
  filter: false,
};

export function IssueShortcutDialogs() {
  const [state, setState] = React.useState<State>(defaultState);

  useShortcutHotKeys('s', () => stateChange(true, 'status'), [
    SCOPES.AllIssues,
  ]);
  useShortcutHotKeys('a', () => stateChange(true, 'assignee'), [
    SCOPES.AllIssues,
  ]);
  useShortcutHotKeys('l', () => stateChange(true, 'label'), [SCOPES.AllIssues]);
  useShortcutHotKeys('p', () => stateChange(true, 'priority'), [
    SCOPES.AllIssues,
  ]);

  const stateChange = (value: boolean, forDialog: string) => {
    setState((currentState) => ({ ...currentState, [forDialog]: value }));
  };

  return (
    <>
      <StatusDialog
        open={state.status}
        setOpen={(value) => stateChange(value, 'status')}
      />
      <AssigneeDialog
        open={state.assignee}
        setOpen={(value) => stateChange(value, 'assignee')}
      />
      <LabelDialog
        open={state.label}
        setOpen={(value) => stateChange(value, 'label')}
      />
      <PriorityDialog
        open={state.priority}
        setOpen={(value) => stateChange(value, 'priority')}
      />
    </>
  );
}
