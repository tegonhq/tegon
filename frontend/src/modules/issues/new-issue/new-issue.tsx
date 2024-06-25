/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { useGithubAccounts } from 'modules/settings/workspace-settings/integrations/github/github-utils';

import { cn } from 'common/lib/utils';
import { SCOPES } from 'common/scopes';
import { IntegrationName } from 'common/types/integration-definition';
import type { IssueType } from 'common/types/issue';

import { Button, buttonVariants } from 'components/ui/button';
import { Editor, type EditorT } from 'components/ui/editor';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/form';
import { Switch } from 'components/ui/switch';
import { useToast } from 'components/ui/use-toast';
import { useScope } from 'hooks';
import { useTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import {
  type CreateIssueParams,
  useCreateIssueMutation,
} from 'services/issues/create-issue';

import { useContextStore } from 'store/global-context-provider';

import { DuplicateIssuesView } from './duplicates-view';
import { IssueSuggestions } from './issue-suggestions';
import { NewIssueDropdowns } from './new-issue-dropdowns';
import {
  getDefaultValues,
  enableBidirectionalSwitch,
  setDefaultValuesAgain,
  isBidirectionalEnabled,
} from './new-issue-utils';
import { NewIssueSchema } from './new-issues-type';
import { FileUpload } from '../single-issue/left-side/file-upload/file-upload';

interface NewIssueProps {
  onClose: () => void;
  teamIdentifier: string;
  parentId?: string;
}

export function NewIssue({ onClose, teamIdentifier, parentId }: NewIssueProps) {
  useScope(SCOPES.NewIssue);
  const { workspaceSlug } = useParams();
  const team = useTeam(teamIdentifier);
  const { issuesStore } = useContextStore();

  const { mutate: createIssue, isLoading } = useCreateIssueMutation({
    onSuccess: (data: IssueType) => {
      toast({
        title: 'Issue Created',
        description: (
          <div className="flex flex-col gap-1">
            <div>
              {data.number} - {data.title}
            </div>
            <div>
              <Link
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'px-0 text-primary',
                )}
                href={`/${workspaceSlug}/issue/${team.identifier}-${data.number}`}
              >
                view issue
              </Link>
            </div>
          </div>
        ),
      });
    },
  });

  const workflows = useTeamWorkflows(teamIdentifier);

  const pathname = usePathname();
  const [, rerenderHack] = React.useState<string[]>([]);
  const [editor, setEditor] = React.useState<EditorT>(undefined);

  const { toast } = useToast();

  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const enableBidirectionalOption = enableBidirectionalSwitch(
    githubAccounts,
    team.id,
  );
  const isBidirectional = isBidirectionalEnabled(githubAccounts, team.id);
  const defaultValues = getDefaultValues(workflows, pathname, isBidirectional);

  const [description, setDescription] = React.useState('');

  const form = useForm<z.infer<typeof NewIssueSchema>>({
    resolver: zodResolver(NewIssueSchema),
    defaultValues,
  });

  // This is to change the default value for the workflow
  React.useEffect(() => {
    setDefaultValuesAgain(form, workflows, pathname, isBidirectional);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdentifier]);

  const onSubmit = (values: CreateIssueParams) => {
    delete values['descriptionString'];

    createIssue({ ...values, teamId: team.id, parentId });
    onClose();
  };

  const setDescriptionValue = useDebouncedCallback((value) => {
    setDescription(value);
  }, 500);

  // Shortcuts
  useHotkeys(`${Key.Meta}+${Key.Enter}`, () => form.handleSubmit(onSubmit)(), [
    SCOPES.NewIssue,
  ]);

  const parentIssue = parentId ? issuesStore.getIssueById(parentId) : undefined;

  return (
    <div className="flex flex-col gap-2">
      {parentIssue && (
        <div className="bg-accent text-accent-foreground rounded-md ml-2 p-2 py-1 flex gap-2 justify-start w-fit">
          <div>Parent: </div>
          <div>
            {team.identifier}-{parentIssue.number}
          </div>
          <div className="max-w-[300px]">
            <div className="truncate">{parentIssue.title}</div>
          </div>
        </div>
      )}
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
                        onCreate={(editor) => setEditor(editor)}
                        onChange={(value, valueString) => {
                          field.onChange(value);
                          form.setValue('descriptionString', valueString);
                          setDescriptionValue(valueString);
                        }}
                        className="min-h-[50px] mb-8"
                        autoFocus
                        // This is when meta+Enter is triggered on description
                        onSubmit={() => {
                          form.handleSubmit(onSubmit)();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end w-full py-1">
              <FileUpload editor={editor} />
            </div>

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

            <NewIssueDropdowns form={form} teamIdentifier={teamIdentifier} />
          </div>

          <div
            className={cn(
              'flex items-center justify-between p-3',
              !enableBidirectionalOption && 'justify-end',
            )}
          >
            {enableBidirectionalOption && (
              <div className="flex justify-between items-center">
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
              <Button
                variant="ghost"
                size="sm"
                isLoading={isLoading}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isLoading}
              >
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
