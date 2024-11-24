import { observer } from 'mobx-react-lite';
import React from 'react';
import { createContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { SCOPES } from 'common/scopes';
import type { IssueType } from 'common/types';

import { NewIssue } from './new-issue';

interface ContextType {
  newIssue: boolean;
  openNewIssue: (defaultValues: Partial<IssueType>) => void;
  closeNewIssue: () => void;
}

export const NewIssueContext = createContext<ContextType>(undefined);

export const NewIssueProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [newIssue, setNewIssue] = React.useState<{
      newIssue: boolean;
      defaultValues: Partial<IssueType>;
    }>({ newIssue: false, defaultValues: {} });

    useHotkeys(
      'c',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        setNewIssue({ newIssue: true, defaultValues: {} });
        e.preventDefault();
      },
      { scopes: [SCOPES.Global] },
      [],
    );

    const openNewIssue = (defaultValues: Partial<IssueType>) => {
      setNewIssue({ newIssue: true, defaultValues });
    };

    const closeNewIssue = () => {
      setNewIssue({ newIssue: false, defaultValues: {} });
    };

    return (
      <NewIssueContext.Provider
        value={{ newIssue: newIssue.newIssue, openNewIssue, closeNewIssue }}
      >
        {newIssue.newIssue && (
          <NewIssue
            open={newIssue.newIssue}
            setOpen={(value: boolean) => {
              if (value) {
                openNewIssue({});
              } else {
                closeNewIssue();
              }
            }}
            defaultValues={newIssue.defaultValues}
          />
        )}
        {children}
      </NewIssueContext.Provider>
    );
  },
);

export const useNewIssue = () => {
  const newIssueContext = React.useContext(NewIssueContext);

  return newIssueContext;
};
