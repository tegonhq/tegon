import { FormField, FormItem, FormControl } from '@tegonhq/ui/components/form';
import React from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import {
  IssueAssigneeDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueStatusDropdown,
} from '../components';
import {
  ProjectDropdown,
  ProjectMilestoneDropdown,
} from '../components/issue-metadata/project';

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

  return (
    <>
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

      <FormField
        control={form.control}
        name={inputName('priority')}
        render={({ field }) => (
          <FormItem>
            <FormControl className="max-w-[200px]">
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
        name={inputName('projectId')}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ProjectDropdown
                value={field.value}
                onChange={field.onChange}
                teamIdentifier={teamIdentifier}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {values.projectId && (
        <FormField
          control={form.control}
          name={inputName('projectMilestoneId')}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProjectMilestoneDropdown
                  value={field.value}
                  onChange={field.onChange}
                  teamIdentifier={teamIdentifier}
                  projectId={values.projectId}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </>
  );
}
