import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { LabelLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import type { ProjectMilestoneType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { ProjectMilestoneDropdownContent } from './project-milestone-dropdown-content';

export enum ProjectMilestoneDropdownVariant {
  NO_BACKGROUND = 'NO_BACKGROUND',
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface ProjectMilestoneDropdownProps {
  value?: string;
  onChange?: (projectId: string) => void;
  variant?: ProjectMilestoneDropdownVariant;
  teamIdentifier: string;
  projectId?: string;
}

export function ProjectMilestoneDropdown({
  value,
  onChange,
  variant = ProjectMilestoneDropdownVariant.DEFAULT,
  projectId,
}: ProjectMilestoneDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { projectMilestonesStore } = useContextStore();
  const milestones = projectMilestonesStore.getMilestonesForProjects([
    projectId,
  ]);

  const getProjectMilestone = (projectMilestoneId: string) => {
    return milestones.find(
      (milestone: ProjectMilestoneType) => milestone.id === projectMilestoneId,
    );
  };

  function getTrigger() {
    if (variant === ProjectMilestoneDropdownVariant.NO_BACKGROUND) {
      return (
        <>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'h-5 w-5 flex items-center justify-between !bg-transparent shadow-none p-0 border-0 focus-visible:ring-1 focus-visible:border-primary',
            )}
          >
            {value ? (
              <>{getProjectMilestone(value).name}</>
            ) : (
              <div className="flex items-center justify-center">
                <LabelLine size={20} className="mr-1 text-muted-foreground" />
              </div>
            )}
          </Button>
        </>
      );
    }

    if (variant === ProjectMilestoneDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center bg-transparent px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <LabelLine className="h-5 w-5 text-[9px] mr-2" />
              {getProjectMilestone(value).name}
            </>
          ) : (
            <div className="text-muted-foreground flex">
              <LabelLine size={20} className="mr-2" />
              No Project Milestone
            </div>
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="link"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'flex items-center justify-between focus-visible:ring-1 focus-visible:border-primary gap-1',
        )}
      >
        {value ? (
          <>
            <LabelLine className="w-5 h-5 text-[9px]" />

            {getProjectMilestone(value).name}
          </>
        ) : (
          <>
            <LabelLine size={20} className="mr-1" /> No Project Milestone
          </>
        )}
      </Button>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Set project..." autoFocus />
            <ProjectMilestoneDropdownContent
              onClose={() => setOpen(false)}
              projectMilestones={milestones}
              onChange={onChange}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
