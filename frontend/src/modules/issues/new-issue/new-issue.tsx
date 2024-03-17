/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from 'common/lib/utils';

import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem } from 'components/ui/form';
import { useTeam } from 'hooks/teams';

import {
  type CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues/create-issue';

import { NewIssueSchema } from './new-issues-type';
import {
  IssueAssigneeDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueStatusDropdown,
} from '../components';
import { IssueDescription } from '../single-issue/left-side/issue-description';

interface NewIssueProps {
  onClose: () => void;
  teamIdentfier: string;
  parentId?: string;
}

export function NewIssue({ onClose, teamIdentfier, parentId }: NewIssueProps) {
  const { mutate: createIssue, isLoading } = useCreateIssueMutation({
    onSuccess: () => {},
  });
  const team = useTeam(teamIdentfier);

  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues: {
      labelIds: [],
      priority: 0,
    },
  });

  const onSubmit = (values: CreateIssueParams) => {
    createIssue({ ...values, teamId: team.id, parentId });
    onClose();
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        parentId &&
          'bg-background backdrop-blur-md border dark:bg-gray-700/20 shadow-md rounded-md py-1 pt-3 px-2',
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-3 pt-0 ">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <IssueDescription {...field} />
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
                        teamIdentfier={teamIdentfier}
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
              'flex items-center justify-end p-2',
              !parentId && 'border-t gap-2',
              parentId && 'gap-2',
            )}
          >
            <Button
              size="sm"
              variant="secondary"
              isLoading={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading}>
              Create issue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
