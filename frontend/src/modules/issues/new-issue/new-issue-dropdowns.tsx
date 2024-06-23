/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { UseFormReturn } from 'react-hook-form';

import React from 'react';

import { FormField, FormItem, FormControl } from 'components/ui/form';

import {
  IssueStatusDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueAssigneeDropdown,
} from '../components';

interface NewIssueDropdownsProps {
  form: UseFormReturn;
  teamIdentifier: string;
}

export function NewIssueDropdowns({
  form,
  teamIdentifier,
}: NewIssueDropdownsProps) {
  return (
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
                teamIdentifier={teamIdentifier}
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
                teamIdentifier={teamIdentifier}
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
  );
}
