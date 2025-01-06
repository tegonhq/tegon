import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Project } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { ProjectDropdownContent } from 'modules/issues/components/issue-metadata/project';

import type { ProjectType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

interface IssueProjectDropdownProps {
  value?: string[];
  onChange?: (projectIds: string[]) => void;
}

export const IssueProjectDropdown = observer(
  ({ value, onChange }: IssueProjectDropdownProps) => {
    const [open, setOpen] = React.useState(false);
    const { projectsStore } = useContextStore();
    const team = useCurrentTeam();

    const projects = team
      ? projectsStore.getProjectWithTeamId(team.id)
      : projectsStore.getProjects;

    const getProject = (projectId: string) => {
      return projects.find((project: ProjectType) => project.id === projectId);
    };

    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              size="sm"
              aria-expanded={open}
              className={cn(
                'flex gap-1 items-center justify-between shadow-none !bg-transparent hover:bg-transparent p-0 border-0 focus-visible:ring-1 focus-visible:border-primary text-muted-foreground',
                value && 'text-foreground',
              )}
            >
              {value.length > 1 ? (
                <>{value.length} Projects</>
              ) : (
                <div className="flex items-center gap-1 shrink min-w-[0px]">
                  <Project className="w-5 h-5 text-[9px] shrink-0" />

                  <div className="truncate"> {getProject(value[0]).name}</div>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput placeholder="Set project..." autoFocus />
              <ProjectDropdownContent
                onClose={() => setOpen(false)}
                projects={projects}
                onChange={onChange}
                value={value}
                multiple
              />
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
