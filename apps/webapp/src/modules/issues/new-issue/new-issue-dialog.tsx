import { Dialog, DialogContent } from '@tegonhq/ui/components/dialog';

import { NewIssue, type NewIssueProps } from './new-issue';

interface NewIssueDialogProps extends NewIssueProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const NewIssueDialog = (props: NewIssueDialogProps) => {
  const { open, setOpen } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        closeIcon={false}
        className="sm:max-w-[600px] min-w-[700px] gap-2"
      >
        <NewIssue {...props} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
