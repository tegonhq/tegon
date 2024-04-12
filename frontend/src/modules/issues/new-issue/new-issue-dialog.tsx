/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowDropRightLine } from '@remixicon/react';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { SCOPES } from 'common/scopes';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';

import { NewIssue } from './new-issue';
import { TeamDropdown } from './team-dropdown';

interface NewIssueDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function NewIssueDialog({ open, setOpen }: NewIssueDialogProps) {
  const [team, setTeam] = React.useState(undefined);

  useHotkeys('c', () => setOpen(true), { scopes: [SCOPES.Global] });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="p-3 pb-0">
          <DialogTitle className="text-sm text-muted-foreground/80 font-normal">
            <div className="flex gap-1 items-center">
              <TeamDropdown onChange={(value) => setTeam(value)} value={team} />

              <RiArrowDropRightLine size={18} />

              <div>New issue</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {team && (
          <NewIssue onClose={() => setOpen(false)} teamIdentfier={team} />
        )}
      </DialogContent>
    </Dialog>
  );
}
