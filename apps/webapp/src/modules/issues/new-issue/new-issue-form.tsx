import { Editor } from '@tegonhq/ui/components/editor/index';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@tegonhq/ui/components/form';
import { Switch } from '@tegonhq/ui/components/switch';
import { Button } from '@tegonhq/ui/components/ui/button';
import { cn } from '@tegonhq/ui/lib/utils';
import React from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { useGithubAccounts } from 'modules/settings/workspace-settings/integrations/github/github-utils';

import { IntegrationName } from 'common/types/integration-definition';

import { useContextStore } from 'store/global-context-provider';

import { NewIssueMetadata } from './new-issue-metadata';
import {
  enableBidirectionalSwitch,
  isBidirectionalEnabled,
  setDefaultValuesAgain,
  useTeamForNewIssue,
} from './new-issue-utils';
import { TeamDropdown } from './team-dropdown';
import { AddIssueMetadata } from '../components/add-issue-metadata';

interface NewIssueFormProps {
  // Used in subissue workflow
  isSubIssue: boolean;
  index: number;
  // This is the ID which comes from other components
  // This is not used in sub-issue workflow
  parentId: string | undefined;
  form: UseFormReturn;

  // To show loading for buttons
  isLoading: boolean;

  onClose: () => void;
}

export function NewIssueForm({
  isSubIssue,
  form,
  index,
  isLoading,
  onClose,
}: NewIssueFormProps) {
  const { team, setTeam } = useTeamForNewIssue();
  const { workflowsStore } = useContextStore();

  // Check if bidirectinal is enabled
  const { githubAccounts } = useGithubAccounts(IntegrationName.Github);
  const enableBidirectionalOption = enableBidirectionalSwitch(
    githubAccounts,
    team.id,
  );
  const isBidirectional =
    isBidirectionalEnabled(githubAccounts, team.id) && !isSubIssue;

  // This is to change the default value for the workflow
  React.useEffect(() => {
    const workflows = workflowsStore.getWorkflowsForTeam(team.id);
    setDefaultValuesAgain({
      form,
      index,
      workflows,
      isBidirectional,
      teamId: team.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  function inputName(name: string) {
    return `issues.${index}.${name}`;
  }

  const onChange = (id: string, value: string) => {
    form.setValue(inputName(id), value);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="p-4 text-lg font-normal flex justify-between items-center">
        <h3> New issue </h3>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0 overflow-hidden">
        <FormField
          control={form.control}
          name={inputName('description')}
          render={({ field }) => {
            return (
              <FormItem className="h-full flex flex-col p-3 bg-background-3 rounded overflow-y-auto">
                <FormControl>
                  <Editor
                    {...field}
                    className="min-h-[200px]"
                    autoFocus
                    editorClassName="min-h-[300px]"
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <div className="bg-background-3 rounded p-3 w-full flex justify-between flex-wrap gap-1">
          <div className="flex gap-2">
            <TeamDropdown
              value={team.identifier}
              onChange={(value: string) => setTeam(value)}
            />
            <NewIssueMetadata
              index={index}
              form={form}
              teamIdentifier={team.identifier}
            />
          </div>
          <div className="flex items-center">
            <AddIssueMetadata
              teamIdentifier={team.identifier}
              form={form}
              index={index}
              onChange={onChange}
            />
          </div>
        </div>

        <div
          className={cn(
            'flex items-center justify-between p-3 pr-0 pb-0 shrink-0',
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
              type="button"
              isLoading={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} variant="secondary">
              Create issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
