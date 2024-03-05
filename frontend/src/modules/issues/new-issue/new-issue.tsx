/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/form';
import { Textarea } from 'components/ui/textarea';
import { useCurrentTeam } from 'hooks/teams';

import {
  CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues/create-issue';

import { IssueAssigneeDropdown } from './issue-assignee-dropdown';
import { IssueLabelDropdown } from './issue-label-dropdown';
import { IssuePriorityDropdown } from './issue-priority-dropdown';
import { IssueStatusDropdown } from './issue-status-dropdown';
import { NewIssueSchema } from './new-issues-type';

export function NewIssue() {
  const { mutate: createIssue, isLoading } = useCreateIssueMutation({
    onSuccess: () => {},
  });
  const team = useCurrentTeam();
  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues: {
      labelIds: [],
      priority: 0,
    },
  });

  const onSubmit = (values: CreateIssueParams) => {
    createIssue({ ...values, teamId: team.id });
  };

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-3 pt-0 ">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="!border-0 p-0 shadow-none text-md focus-visible:ring-0"
                      placeholder="Add description..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
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
                      />
                    </FormControl>

                    <FormMessage />
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
                      />
                    </FormControl>

                    <FormMessage />
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

                    <FormMessage />
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

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end p-2 border-t">
            <Button type="submit" isLoading={isLoading}>
              Create issue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
