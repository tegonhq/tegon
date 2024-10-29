// import { WORKFLOW_CATEGORY_ICONS } from 'common/types'

// import type { WorkflowType } from 'common/types'

import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import { TeamLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import type { TeamType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { TeamsDropdownContent } from './teams-dropdown-content';
import { ProjectDropdownVariant } from '../status';

interface TeamsProps {
  value?: string[];
  onChange?: (teams: string[]) => void;
  variant?: ProjectDropdownVariant;
}

export function TeamsDropdown({ value, onChange, variant }: TeamsProps) {
  const [open, setOpen] = React.useState(false);
  const { teamsStore } = useContextStore();

  function getTrigger() {
    const teams = value.map((team: string) =>
      teamsStore.getTeamWithId(team),
    ) as TeamType[];

    if (variant === ProjectDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className="flex items-center px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary"
        >
          <TeamIcon name={teams[0].name} className="mr-1" />
          {teams.length > 1
            ? `${teams.map((team) => team.identifier).join(', ')}`
            : `${teams[0].name}`}
        </Button>
      );
    }

    return (
      <Button
        variant="link"
        role="combobox"
        aria-expanded={open}
        className="flex items-center gap-1 justify-between shadow-none focus-visible:ring-1 focus-visible:border-primary "
      >
        <TeamIcon name={teams[0].name} />

        {teams.length > 1
          ? `${teams.map((team) => team.identifier).join(', ')}`
          : `${teams[0].name}`}
      </Button>
    );
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="link"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="flex items-center p-0 justify-between focus-visible:ring-1 focus-visible:border-primary "
          >
            {getTrigger()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Set status..." autoFocus />
            <TeamsDropdownContent
              onChange={onChange}
              onClose={() => setOpen(false)}
              value={value}
              multiple
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
