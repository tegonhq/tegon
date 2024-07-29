import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateIssueCommentMutation,
  useUpdateIssueMutation,
} from '@tegonhq/services/issues';
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

import {
  IssueAssigneeDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueStatusDropdown,
} from 'modules/issues/components';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { UserContext } from 'store/user-context';

interface TriageAcceptModalProps {
  setDialogOpen: (value: boolean) => void;
}

const AcceptIssueSchema = z.object({
  comment: z.optional(z.string()),

  stateId: z.string(),

  labelIds: z.array(z.string()),
  priority: z.number().nullable(),
  assigneeId: z.string().optional().nullable(),
});

interface AcceptIssueParams {
  comment: string;
  stateId: string;

  labelIds: string[];
  priority: number;
  assigneeId?: string;
}

export function TriageAcceptModal({ setDialogOpen }: TriageAcceptModalProps) {
  const currentTeam = useCurrentTeam();
  const issue = useIssueData();
  const currentUser = React.useContext(UserContext);
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { mutate: commentIssue } = useCreateIssueCommentMutation({});

  const form = useForm<z.infer<typeof AcceptIssueSchema>>({
    resolver: zodResolver(AcceptIssueSchema),
    defaultValues: {
      labelIds: issue.labelIds,
      priority: issue.priority ?? 0,
      assigneeId: issue.assigneeId,
      stateId: issue.stateId,
    },
  });

  const onSubmit = async (values: AcceptIssueParams) => {
    updateIssue({
      id: issue.id,
      teamId: currentTeam.id,
      labelIds: values.labelIds,
      stateId: values.stateId,
      assigneeId: values.assigneeId,
      priority: values.priority,
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
              Accept
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
                            placeholder="Add a comment"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name="stateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IssueStatusDropdown
                            onChange={field.onChange}
                            value={field.value}
                            teamIdentifier={currentTeam.identifier}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="labelIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IssueLabelDropdown
                            value={field.value}
                            onChange={field.onChange}
                            teamIdentifier={currentTeam.identifier}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IssuePriorityDropdown
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IssueAssigneeDropdown
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div
                className={cn(
                  'flex items-center justify-end p-2 border-t gap-2',
                )}
              >
                <Button type="submit" variant="secondary">
                  Accept
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
