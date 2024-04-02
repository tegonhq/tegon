/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { useGithubAccounts } from 'modules/settings/integrations/github/github-utils';

import { cn } from 'common/lib/utils';
import { IntegrationName } from 'common/types/integration-definition';

import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/form';
import { Switch } from 'components/ui/switch';
import { useTeam } from 'hooks/teams';

import {
  type CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues/create-issue';

import { DuplicateIssuesView } from './duplicates-view';
import { isBirectionalEnabled } from './new-issue-utils';
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
  const [description, setDescription] = React.useState('');
  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const isBidirectional = isBirectionalEnabled(githubAccounts, team.id);

  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues: {
      labelIds: [],
      priority: 0,
      isBidirectional: false,
    },
  });

  const onSubmit = (values: CreateIssueParams) => {
    createIssue({ ...values, teamId: team.id, parentId });
    onClose();
  };

  const setDescriptionValue = useDebouncedCallback((value) => {
    setDescription(value);
  }, 500);

  return (
    <div
      className={cn(
        'flex flex-col',
        parentId &&
          'bg-background backdrop-blur-md border dark:bg-slate-700/20 shadow-md rounded-md py-1 pt-3 px-2',
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
                    <IssueDescription
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        setDescriptionValue(value);
                      }}
                    />
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
                        teamIdentfier={teamIdentfier}
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
              'flex items-center justify-between p-3',
              !parentId && 'border-t gap-2',
              parentId && 'gap-2',
              !isBidirectional && 'justify-end',
            )}
          >
            {isBidirectional && (
              <div className="flex justify-between text-xs items-center">
                <div>
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="isBidirectional"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              id="isBidirectional"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-muted-foreground min-w-[150px] ml-2">
                            Create github
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" size="sm" isLoading={isLoading}>
                Create issue
              </Button>
            </div>
          </div>
        </form>
      </Form>
      {form.getValues().description && (
        <DuplicateIssuesView description={description} />
      )}
    </div>
  );
}
