import { FormField, FormItem, FormControl } from '@tegonhq/ui/components/form';
import React from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import {
  IssueAssigneeDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueStatusDropdown,
} from '../components';

interface NewIssueMetadataProps {
  form: UseFormReturn;
  teamIdentifier: string;
  index: number;
}

export function NewIssueMetadata({
  form,
  teamIdentifier,
  index,
}: NewIssueMetadataProps) {
  const values = useWatch({
    control: form.control,
    name: `issues.${index}`,
  });

  function inputName(name: string) {
    return `issues.${index}.${name}`;
  }

  const toShow = (id: string) => {
    if (id.includes('labelIds')) {
      const value = values[id];
      return typeof value === 'object' ? value && value.length > 0 : !!value;
    }

    return !!values[id];
    // return !!values[id];
  };

  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name={inputName('stateId')}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <IssueStatusDropdown
                onChange={field.onChange}
                value={field.value}
                teamIdentifier={teamIdentifier}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={inputName('labelIds')}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <IssueLabelDropdown
                value={field.value}
                onChange={field.onChange}
                teamIdentifier={teamIdentifier}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={inputName('assigneeId')}
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

      {toShow('priority') && (
        <FormField
          control={form.control}
          name={inputName('priority')}
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
      )}
    </div>
  );
}
