import { Button } from '@tegonhq/ui/components/button';
import { Editor, EditorExtensions } from '@tegonhq/ui/components/editor/index';
import { FormControl, FormField, FormItem } from '@tegonhq/ui/components/form';
import { Loader } from '@tegonhq/ui/components/loader';
import { DeleteLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  useWatch,
  type UseFormReturn,
  type UseFieldArrayRemove,
} from 'react-hook-form';

import { AiWritingExtension } from 'common/editor/ai-writing';
import type { IssueType } from 'common/types';

import { useSuggestionItems } from './hooks';
import { NewIssueHeader } from './new-issue-header';
import { NewIssueMetadata } from './new-issue-metadata';
import { NewIssueTitle } from './new-issue-title';
import {
  setDefaultValuesAgain,
  useDefaultValues,
  useTeamForNewIssue,
} from './new-issue-utils';
import { SubIssueSelectorNI } from './sub-issue-selector-ni';
import { TeamDropdown } from './team-dropdown';
import { AddIssueMetadata } from '../components/add-issue-metadata';

interface NewIssueFormProps {
  // Used in subissue workflow
  isSubIssue: boolean;
  index: number;
  defaultValues: Partial<IssueType>;
  form: UseFormReturn;

  // To show loading for buttons
  isLoading: boolean;

  onClose: () => void;
  isTemplate?: boolean;

  subIssueOperations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    append: any;
    remove: UseFieldArrayRemove;
  };
}

export const NewIssueForm = observer(
  ({
    isSubIssue,
    form,
    index,
    defaultValues,
    isLoading,
    onClose,
    subIssueOperations,
    isTemplate,
  }: NewIssueFormProps) => {
    const issue = useWatch({
      control: form.control,
      name: `issues.${index}`,
    });
    const pathname = usePathname();

    const { team, setTeam } = useTeamForNewIssue(issue.teamId);
    const [editor, setEditor] = React.useState(undefined);
    const { suggestionItems, isLoading: aiLoading } =
      useSuggestionItems(subIssueOperations);

    const defaultValuesForForm = useDefaultValues(team, defaultValues);

    // This is to change the default value for the workflow
    React.useEffect(() => {
      setDefaultValuesAgain({
        form,
        index,
        defaultValues: defaultValuesForForm,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team, pathname]);

    function inputName(name: string) {
      return `issues.${index}.${name}`;
    }

    const onChange = (id: string, value: string) => {
      if (id === 'create-sub-issue') {
        subIssueOperations.append({
          teamId: team.id,
        });
      } else {
        form.setValue(inputName(id), value);
      }
    };

    const getCommandsToHide = () => {
      if (isSubIssue) {
        return ['create-sub-issue'];
      }

      return [];
    };

    const resetFormValues = (defaultValues: Partial<IssueType>) => {
      setDefaultValuesAgain({
        form,
        index,
        defaultValues,
      });

      if (editor && defaultValues.description) {
        editor.commands.setContent(JSON.parse(defaultValues.description));
      }
    };

    return (
      <div className="flex flex-col overflow-hidden">
        {!isTemplate && (
          <NewIssueHeader
            team={team}
            setTeam={setTeam}
            resetFormValues={resetFormValues}
          />
        )}

        <div className={cn('flex flex-wrap px-2', isTemplate && 'px-0')}>
          <NewIssueTitle isSubIssue={isSubIssue} form={form} index={index} />
        </div>

        <div className="flex flex-col gap-2 p-4 pt-0 overflow-hidden">
          <FormField
            control={form.control}
            name={inputName('description')}
            render={({ field }) => {
              return (
                <FormItem
                  className={cn(
                    'h-full px-2 flex flex-col rounded overflow-y-auto',
                    isTemplate && 'px-0',
                  )}
                >
                  <FormControl>
                    <Editor
                      {...field}
                      className="new-issue-editor min-h-[100px]"
                      editorClassName="min-h-[100px]"
                      extensions={[AiWritingExtension]}
                      onCreate={(editor) => setEditor(editor)}
                    >
                      <EditorExtensions suggestionItems={suggestionItems}>
                        <SubIssueSelectorNI
                          subIssueOperations={subIssueOperations}
                          teamId={team.id}
                        />
                      </EditorExtensions>
                    </Editor>
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <div className="bg-grayAlpha-100 rounded p-1 w-full flex flex-wrap gap-1 items-center">
            {isTemplate && (
              <TeamDropdown
                value={team.identifier}
                onChange={(value: string) => setTeam(value)}
              />
            )}
            <NewIssueMetadata index={index} form={form} team={team} />
            <AddIssueMetadata
              teamIdentifier={team.identifier}
              form={form}
              index={index}
              onChange={onChange}
              hideCommands={getCommandsToHide()}
            />
          </div>

          <div className="flex items-center p-3 pr-0 pb-0 shrink-0 justify-end">
            <div className="flex gap-2 items-center">
              {aiLoading && <Loader text="Thinking..." variant="horizontal" />}
              {isSubIssue && (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    subIssueOperations.remove(index);
                  }}
                >
                  <DeleteLine size={16} />
                </Button>
              )}
              {!!onClose && (
                <Button
                  variant="ghost"
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" isLoading={isLoading} variant="secondary">
                {isTemplate ? 'Save template' : 'Create issue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
