import { Dialog, DialogContent } from '@tegonhq/ui/components/dialog';

import { LinkedIssueSubType } from 'common/types/linked-issue';

import { AddLinkedIssue } from './add-linked-issue';

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
          <AddLinkedIssue
            issueId={issueId}
            onClose={() => setOpen(undefined)}
            title="Enter URL of Github Issue to link"
            description="Copy the URL from the browser when viewing the issue"
            placeholder="https://github.com/tegonhq/tegon/issues/1"
            type={LinkedIssueSubType.GithubIssue}
            askTitleInForm={false}
          />
        )}
        {open === LinkedIssueSubType.GithubPullRequest && (
          <AddLinkedIssue
            issueId={issueId}
            onClose={() => setOpen(undefined)}
            title="Enter URL of Github PR to link"
            description="Copy the URL from the browser when viewing the issue"
            placeholder="https://github.com/tegonhq/tegon/pull/1"
            type={LinkedIssueSubType.GithubPullRequest}
            askTitleInForm={false}
          />
        )}
        {open === LinkedIssueSubType.Slack && (
          <AddLinkedIssue
            issueId={issueId}
            onClose={() => setOpen(undefined)}
            title="Enter Slack thread link"
            description="Copy the URL from the thread"
            placeholder="https://test-app.slack.com/archives/C03B0DC55DE/p1712922413073899"
            type={LinkedIssueSubType.Slack}
            askTitleInForm={false}
          />
        )}
        {open === LinkedIssueSubType.Sentry && (
          <AddLinkedIssue
            issueId={issueId}
            onClose={() => setOpen(undefined)}
            title="Enter Sentry issue link"
            description="Copy the URL from the browser"
            placeholder="https://tegon.sentry.io/issues/5310267420"
            type={LinkedIssueSubType.Sentry}
            askTitleInForm={false}
          />
        )}
        {open === LinkedIssueSubType.ExternalLink && (
          <AddLinkedIssue
            issueId={issueId}
            onClose={() => setOpen(undefined)}
            title="Add link to issue"
            placeholder="https://"
            type={LinkedIssueSubType.ExternalLink}
            askTitleInForm
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
