/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { useGithubAccounts } from 'modules/settings/integrations/github/github-utils';

import { cn } from 'common/lib/utils';
import { IntegrationName } from 'common/types/integration-definition';
import type { IssueType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Editor } from 'components/ui/editor';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/form';
import { Switch } from 'components/ui/switch';
import { useToast } from 'components/ui/use-toast';
import { useTeam } from 'hooks/teams';
import { useAllTeamWorkflows } from 'hooks/workflows';

import {
  type CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues/create-issue';

import { DuplicateIssuesView } from './duplicates-view';
import { IssueSuggestions } from './issue-suggestions';
import { NewIssueDropdowns } from './new-issue-dropdowns';
import {
  getDefaultValues,
  enableBidirectionalSwitch,
  setDefaultValuesAgain,
  isBidirectionalEnabled,
} from './new-issue-utils';
import { draftKey, NewIssueSchema } from './new-issues-type';

interface NewIssueProps {
  onClose: () => void;
  teamIdentfier: string;
  parentId?: string;
}

export function NewIssue({ onClose, teamIdentfier, parentId }: NewIssueProps) {
  const { mutate: createIssue, isLoading } = useCreateIssueMutation({
    onSuccess: (data: IssueType) => {
      toast({
        title: 'Issue Created',
        description: `${data.number} - ${data.title}`,
      });
    },
  });
  const team = useTeam(teamIdentfier);
  const workflows = useAllTeamWorkflows(teamIdentfier);

  const pathname = usePathname();
  const [description, setDescription] = React.useState('');
  const [, rerenderHack] = React.useState<string[]>([]);
  const { toast } = useToast();

  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const enableBidirectionalOption = enableBidirectionalSwitch(
    githubAccounts,
    team.id,
  );
  const isBidirectional = isBidirectionalEnabled(githubAccounts, team.id);

  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues: getDefaultValues(workflows, pathname, isBidirectional),
  });

  // This is to change the default value for the workflow
  React.useEffect(() => {
    setDefaultValuesAgain(form, workflows, pathname, isBidirectional);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdentfier]);

  const onSubmit = (values: CreateIssueParams) => {
    createIssue({ ...values, teamId: team.id, parentId });
    onClose();
  };

  React.useEffect(() => {
    return () => {
      if (
        !form.formState.isSubmitted &&
        Object.keys(form.formState.dirtyFields).length > 0
      ) {
        localStorage.setItem(draftKey, JSON.stringify(form.getValues()));
      }
    };
  }, [form]);

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
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Editor
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          setDescriptionValue(value);
                        }}
                        className="text-slate-600 dark:text-slate-400 min-h-[50px] mb-8"
                        autoFocus
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            {description.trim() && (
              <IssueSuggestions
                teamId={team.id}
                labelIds={form.getValues('labelIds')}
                assigneeId={form.getValues('assigneeId')}
                setLabelValue={(labelIds: string[]) => {
                  form.setValue('labelIds', labelIds);
                  rerenderHack(labelIds);
                }}
                setAssigneeValue={(assigneeId: string) => {
                  form.setValue('assigneeId', assigneeId);
                  rerenderHack([assigneeId]);
                }}
                description={description}
              />
            )}

            <NewIssueDropdowns form={form} teamIdentfier={teamIdentfier} />
          </div>

          <div
            className={cn(
              'flex items-center justify-between p-3',
              !parentId && 'border-t gap-2',
              parentId && 'gap-2',
              !enableBidirectionalOption && 'justify-end',
            )}
          >
            {enableBidirectionalOption && (
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
