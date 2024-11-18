import { Button } from '@tegonhq/ui/components/button';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { Textarea } from '@tegonhq/ui/components/textarea';
import { Project } from '@tegonhq/ui/icons';
import React from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { AiWritingExtension } from 'common/editor/ai-writing';

import { ProjectDatePicker } from '../dropdowns/project-date-picker';
import { ProjectStatusDropdown } from '../dropdowns/status';
import { TeamsDropdown } from '../dropdowns/teams';

interface NewProjectFormProps {
  form: UseFormReturn;

  // To show loading for buttons
  isLoading: boolean;
  onClose: () => void;
}

export function NewProjectForm({
  form,
  isLoading,
  onClose,
}: NewProjectFormProps) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="grow">
            <FormControl>
              <div className="flex items-center gap-2">
                <Project size={16} className="mb-1" />
                <Textarea
                  className="border-0 py-0 px-0 resize-none bg-transparent no-scrollbar overflow-hidden outline-none focus-visible:ring-0 text-lg"
                  rows={1}
                  cols={1}
                  autoFocus
                  placeholder="Project title"
                  {...field}
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => {
          return (
            <FormItem className="h-full flex flex-col p-3 bg-background-3 rounded overflow-y-auto">
              <FormControl>
                <Editor
                  {...field}
                  className="new-project-editor min-h-[100px]"
                  editorClassName="min-h-[100px]"
                  placeholder="Describe your project"
                  extensions={[AiWritingExtension]}
                >
                  <EditorExtensions suggestionItems={suggestionItems} />
                </Editor>
              </FormControl>
            </FormItem>
          );
        }}
      />

      <div className="bg-background-3 rounded p-3 w-full flex flex-wrap gap-1 items-center">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            return (
              <ProjectStatusDropdown
                value={field.value}
                onChange={field.onChange}
              />
            );
          }}
        />
        <FormField
          control={form.control}
          name="teams"
          render={({ field }) => {
            return (
              <TeamsDropdown value={field.value} onChange={field.onChange} />
            );
          }}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => {
            return (
              <ProjectDatePicker
                value={field.value}
                onChange={field.onChange}
                text="End date"
              />
            );
          }}
        />
      </div>

      <div className="flex items-center p-3 pr-0 pb-0 shrink-0 justify-end">
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            type="button"
            disabled={isLoading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} variant="secondary">
            Create project
          </Button>
        </div>
      </div>
    </div>
  );
}
