/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowDropRightLine } from '@remixicon/react';
import React from 'react';

import { DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';

import { TeamStoreProvider } from 'store/team-store-provider';

import { NewIssue } from './new-issue';
import { TeamDropdown } from './team-dropdown';

interface NewIssueDialogProps {
  onClose: () => void;
}

export function NewIssueDialog({ onClose }: NewIssueDialogProps) {
  const [team, setTeam] = React.useState(undefined);

  return (
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
        <TeamStoreProvider teamIdentifier={team}>
          <NewIssue onClose={onClose} teamIdentfier={team} />
        </TeamStoreProvider>
      )}
    </DialogContent>
  );
}
