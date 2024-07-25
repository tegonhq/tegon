import { Cross2Icon } from '@radix-ui/react-icons';
import { RiArrowDropRightLine } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@tegonhq/ui/components/dialog';
import React from 'react';

import { NewIssue } from './new-issue';
import { TeamDropdown } from './team-dropdown';

interface NewIssueDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  parentId?: string;
}

export function NewIssueDialog({
  open,
  setOpen,
  parentId,
}: NewIssueDialogProps) {
  const [team, setTeam] = React.useState(undefined);

  const onClose = () => {
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
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <Cross2Icon />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {team && (
            <NewIssue
              onClose={() => setOpen(false)}
              teamIdentifier={team}
              parentId={parentId}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
