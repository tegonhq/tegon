/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { LinkedIssueSubType } from 'common/types/linked-issue';

import { Dialog, DialogContent } from 'components/ui/dialog';

import { AddGithubIssue } from './add-github-issue';
import { AddGithubPR } from './add-github-pr';

interface AddLinkedIssueDialogProps {
  open: LinkedIssueSubType;
  setOpen: (open: LinkedIssueSubType) => void;
  issueId: string;
}

export function AddLinkedIssueDialog({
  open,
  setOpen,
  issueId,
}: AddLinkedIssueDialogProps) {
  return (
    <Dialog
      open={!!open}
      onOpenChange={(open) => {
        if (open) {
          setOpen(LinkedIssueSubType.GithubIssue);
        } else {
          setOpen(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]" closeIcon={false}>
        {open === LinkedIssueSubType.GithubIssue && (
          <AddGithubIssue
            issueId={issueId}
            onClose={() => setOpen(undefined)}
          />
        )}
        {open === LinkedIssueSubType.GithubPullRequest && (
          <AddGithubPR issueId={issueId} onClose={() => setOpen(undefined)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
