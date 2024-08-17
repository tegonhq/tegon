import { zodResolver } from '@hookform/resolvers/zod';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
} from '@tegonhq/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@tegonhq/ui/components/form';
import { Textarea } from '@tegonhq/ui/components/textarea';
import { ChevronRight } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import {
  useCreateIssueCommentMutation,
  useUpdateIssueMutation,
} from 'services/issues';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

interface TriageDeclineModalProps {
  setDialogOpen: (value: boolean) => void;
}

const DeclineIssueSchema = z.object({
  comment: z.optional(z.string()),
});

interface DeclineIssueParams {
  comment: string;
}

export function TriageDeclineModal({ setDialogOpen }: TriageDeclineModalProps) {
  const currentTeam = useCurrentTeam();
  const issue = useIssueData();
  const currentUser = React.useContext(UserContext);
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { mutate: commentIssue } = useCreateIssueCommentMutation({});
  const { workflowsStore } = useContextStore();

  const form = useForm<z.infer<typeof DeclineIssueSchema>>({
    resolver: zodResolver(DeclineIssueSchema),
  });

  const onSubmit = async (values: DeclineIssueParams) => {
    const cancelledWorkflow = workflowsStore.getCancelledWorkflow(
      currentTeam.id,
    );

    updateIssue({
      id: issue.id,
      teamId: currentTeam.id,
      stateId: cancelledWorkflow.id,
    });

    if (values.comment) {
      commentIssue({
        body: values.comment,
        issueId: issue.id,
      });
    }

    setDialogOpen(false);
  };

  return (
    <Dialog open onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="p-3 pb-0">
          <DialogTitle className="text-base font-normal">
            <div className="flex gap-1 items-center">
              Decline
              <ChevronRight size={18} />
              <div>
                {currentTeam.identifier} - {issue.number}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className={cn('flex flex-col')}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-3 pt-0">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-start gap-4">
                          <AvatarText
                            text={currentUser.fullname}
                            className="text-[9px]"
                          />
                          <Textarea
                            {...field}
                            className="focus-visible:ring-0 bg-grayAlpha-100 border-0 mb-4 w-full min-h-[60px] text-foreground p-2"
                            placeholder="Add a reason for declining"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div
                className={cn(
                  'flex items-center justify-end p-2 border-t gap-2',
                )}
              >
                <Button type="submit" variant="secondary">
                  Decline
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
