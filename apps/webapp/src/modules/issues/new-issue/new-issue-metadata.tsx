import { FormField, FormItem, FormControl } from '@tegonhq/ui/components/form';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import type { TeamType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import {
  CycleDropdown,
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
  team: TeamType;
  index: number;
}

export const NewIssueMetadata = observer(
  ({ form, team, index }: NewIssueMetadataProps) => {
    const { projectsStore } = useContextStore();

    const hasProjectsForTeam = projectsStore.hasProjects(team.id);

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
                  teamIdentifier={team.identifier}
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
                  teamIdentifier={team.identifier}
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
                  teamId={team.id}
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

        {team.preferences?.cyclesEnabled && (
          <FormField
            control={form.control}
            name={inputName('cycleId')}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CycleDropdown
                    value={field.value}
                    onChange={field.onChange}
                    teamIdentifier={team.identifier}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {hasProjectsForTeam && (
          <FormField
            control={form.control}
            name={inputName('projectId')}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProjectDropdown
                    value={field.value}
                    onChange={field.onChange}
                    teamIdentifier={team.identifier}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {hasProjectsForTeam && values.projectId && (
          <FormField
            control={form.control}
            name={inputName('projectMilestoneId')}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProjectMilestoneDropdown
                    value={field.value}
                    onChange={field.onChange}
                    teamIdentifier={team.identifier}
                    projectId={values.projectId}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </>
    );
  },
);
