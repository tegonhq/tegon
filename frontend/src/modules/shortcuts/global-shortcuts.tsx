import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { NewIssueDialog } from 'modules/issues/new-issue/new-issue-dialog';
import { SearchDialog } from 'modules/search';

import { SCOPES } from 'common/scopes';

import { CommandDialog } from './command';

interface State {
  newIssue: boolean;
  search: boolean;
}

const defaultState: State = {
  newIssue: false,
  search: false,
};

export function GlobalShortcuts() {
  const [state, setState] = React.useState<State>(defaultState);

  useHotkeys(
    'c',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      stateChange(true, 'newIssue');

      e.preventDefault();
    },
    { scopes: [SCOPES.Global] },
  );

  useHotkeys(
    `${Key.Meta}+/`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      stateChange(true, 'search');

      e.preventDefault();
    },
    { scopes: [SCOPES.Global] },
  );

  const stateChange = (value: boolean, forDialog: string) => {
    setState((currentState) => ({ ...currentState, [forDialog]: value }));
  };

  return (
    <>
      <NewIssueDialog
        open={state.newIssue}
        setOpen={(value) => stateChange(value, 'newIssue')}
      />
      <SearchDialog
        open={state.search}
        setOpen={(value) => stateChange(value, 'search')}
      />
      <CommandDialog
        setDialogState={(value: string) => stateChange(true, value)}
      />
    </>
  );
}
