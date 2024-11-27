import { AdjustableTextArea } from '@tegonhq/ui/components/adjustable-textarea';
import { Button } from '@tegonhq/ui/components/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@tegonhq/ui/components/form';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { AI, IssuesLine } from '@tegonhq/ui/icons';
import { ArrowDownRight } from '@tegonhq/ui/icons';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useAITitleMutation } from 'services/issues';

import { useDescriptionChange } from './new-issue-utils';

interface NewIssueTitleProps {
  form: UseFormReturn;
  index: number;
  isSubIssue: boolean;
}

function getDescription(description: string) {
  try {
    return description ? JSON.parse(description).text : '';
  } catch (e) {
    return description;
  }
}

function getIfTouched(form: UseFormReturn, index: number) {
  if (
    form.formState.touchedFields.issues &&
    form.formState.touchedFields.issues[index]
  ) {
    return !!form.formState.touchedFields.issues[index].title;
  }

  return false;
}

export function NewIssueTitle({ form, index, isSubIssue }: NewIssueTitleProps) {
  const description = useWatch({
    control: form.control,
    name: `issues.${index}.description`,
  });

  const touched = getIfTouched(form, index);

  const descriptionString = getDescription(description);
  const workspace = useCurrentWorkspace();
  const { mutate, isLoading } = useAITitleMutation({
    onSuccess: (data) => {
      if (data) {
        if (data === 'null') {
        } else {
          form.setValue(`issues.${index}.title`, data);
        }
      }
    },
  });

  useDescriptionChange(touched, descriptionString, (description: string) => {
    mutate({ description, workspaceId: workspace.id }), 100, 40;
  });

  return (
    <div className="p-4 text-md font-normal w-full gap-2 flex items-center">
      <FormField
        control={form.control}
        name={`issues.${index}.title`}
        render={({ field }) => (
          <FormItem className="grow">
            <FormControl>
              <div className="flex items-center gap-1">
                {isSubIssue ? (
                  <ArrowDownRight size={16} />
                ) : (
                  <IssuesLine size={16} />
                )}
                <AdjustableTextArea
                  className="border-0 py-0 resize-none bg-transparent no-scrollbar overflow-hidden outline-none focus-visible:ring-0 w-full"
                  autoFocus
                  placeholder="Issue title"
                  {...field}
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            isLoading={isLoading}
            onClick={() => {
              if (descriptionString) {
                mutate({
                  description: descriptionString,
                  workspaceId: workspace.id,
                });
              }
            }}
          >
            <AI size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to generate title</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
