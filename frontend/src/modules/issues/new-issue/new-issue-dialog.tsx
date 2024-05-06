/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Cross2Icon } from '@radix-ui/react-icons';
import { RiArrowDropRightLine } from '@remixicon/react';
import React from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';

import { NewIssue } from './new-issue';
import { draftKey } from './new-issues-type';
import { TeamDropdown } from './team-dropdown';

interface NewIssueDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function NewIssueDialog({ open, setOpen }: NewIssueDialogProps) {
  const [team, setTeam] = React.useState(undefined);
  const [discardDraft, setDiscardDraft] = React.useState(false);

  const onClose = () => {
    const draftData = localStorage.getItem(draftKey);
    if (draftData) {
      setDiscardDraft(true);
    } else {
      setOpen(false);
    }
  };

  const onDiscard = () => {
    localStorage.removeItem(draftKey);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]" closeIcon={false}>
          <DialogHeader className="p-3 pb-0">
            <DialogTitle className="text-sm text-muted-foreground/80 font-normal flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <TeamDropdown
                  onChange={(value) => setTeam(value)}
                  value={team}
                />

                <RiArrowDropRightLine size={18} />

                <div>New issue</div>
              </div>
              <div className="flex">
                <Button variant="ghost" size="xs" onClick={onClose}>
                  <Cross2Icon />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {team && (
            <NewIssue onClose={() => setOpen(false)} teamIdentfier={team} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardDraft} onOpenChange={setDiscardDraft}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this
              the draft issue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDiscard}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
