import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { SCOPES } from 'common/scopes';

import { useContextStore } from 'store/global-context-provider';

import { useCommandNavigator } from './use-command-navigator';
import { CommonDialog } from '../dialogs/common-dialog';

interface CommandDialogProps {
  setDialogState: (state: string) => void;
}

export function CommandDialog({ setDialogState }: CommandDialogProps) {
  const { applicationStore } = useContextStore();
  const [open, setOpen] = React.useState(false);
  const { options, onSelect } = useCommandNavigator({
    setDialogState,
    onClose: () => setOpen(false),
  });

  useHotkeys('meta+k', () => setOpen(true), { scopes: [SCOPES.AllIssues] });

  function getIssueIds() {
    if (applicationStore.hoverIssue) {
      return [applicationStore.hoverIssue];
    }

    return applicationStore.selectedIssues;
  }

  return (
    <CommonDialog
      issueIds={getIssueIds()}
      placeholder="Search command..."
      open={open}
      setOpen={setOpen}
      options={options}
      onSelect={onSelect}
      groupOrder={['Create', 'Navigation', 'Search']}
    />
  );
}
