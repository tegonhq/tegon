import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Project } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import type { ProjectType } from 'common/types';

import { useTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { ProjectDropdownContent } from './project-dropdown-content';

export enum ProjectDropdownVariant {
  NO_BACKGROUND = 'NO_BACKGROUND',
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface ProjectDropdownProps {
  value?: string;
  onChange?: (projectId: string) => void;
  variant?: ProjectDropdownVariant;
  teamIdentifier: string;
}

export function ProjectDropdown({
  value,
  onChange,
  variant = ProjectDropdownVariant.DEFAULT,
  teamIdentifier,
}: ProjectDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { projectsStore } = useContextStore();
  const team = useTeam(teamIdentifier);
  const projects = projectsStore.getProjectWithTeamId(team.id);

  const getProject = (projectId: string) => {
    return projects.find((project: ProjectType) => project.id === projectId);
  };

  function getTrigger() {
    if (variant === ProjectDropdownVariant.NO_BACKGROUND) {
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
              <div className="inline-flex items-center gap-1 pl-1 min-w-[0px]">
                <div className="truncate"> {getProject(value).name}</div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Project size={20} className="mr-1 text-muted-foreground" />
              </div>
            )}
          </Button>
        </>
      );
    }

    if (variant === ProjectDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'bg-transparent px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary inline-flex items-center flex-wrap max-w-[200px]',
          )}
        >
          {value ? (
            <div className="inline-flex items-center gap-1 pl-1 min-w-[0px]">
              <Project className="h-5 w-5 text-[9px] mr-2 shrink-0" />

              <div className="truncate"> {getProject(value).name}</div>
            </div>
          ) : (
            <div className="text-muted-foreground flex">
              <Project size={20} className="mr-2" />
              No Project
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
          'flex items-center justify-between focus-visible:ring-1 focus-visible:border-primary gap-1 flex-wrap max-w-[200px]',
        )}
      >
        {value ? (
          <div className="flex items-center gap-1 shrink min-w-[0px]">
            <Project className="w-5 h-5 text-[9px] shrink-0" />

            <div className="truncate"> {getProject(value).name}</div>
          </div>
        ) : (
          <>
            <Project size={20} className="mr-1" /> No Project
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
            <ProjectDropdownContent
              onClose={() => setOpen(false)}
              projects={projects}
              onChange={onChange}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
