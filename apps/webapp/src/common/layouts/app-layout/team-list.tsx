import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@tegonhq/ui/components/accordion';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import {
  ChevronRight,
  Cycle,
  IssuesLine,
  StackLine,
  TriageLine,
} from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import type { TeamType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

import { Nav } from './nav';

export const TeamList = observer(() => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const currentUser = React.useContext(UserContext);
  const { teamsStore, workspaceStore } = useContextStore();
  // If the team exists in the route path
  const team = useCurrentTeam();
  const teamAccessList =
    workspaceStore.getUserData(currentUser.id)?.teamIds ?? [];
  const teams = teamsStore.teams.filter((team: TeamType) =>
    teamAccessList.includes(team.id),
  );
  const workspace = useCurrentWorkspace();
  const router = useRouter();

  return (
    <div ref={containerRef} className="mt-4">
      <div className="mb-2">Your teams</div>

      <Accordion
        type="single"
        collapsible
        defaultValue={team?.id}
        className="w-full flex flex-col gap-2"
        onValueChange={(value: string) => {
          if (value && value !== team?.id) {
            const newTeam = teams.find((team: TeamType) => team.id === value);
            router.push(`/${workspace.slug}/team/${newTeam.identifier}/all`);
          }
        }}
      >
        {teams.map((team: TeamType) => {
          let links = [
            {
              title: 'Issues',
              icon: IssuesLine,
              href: `/${workspace.slug}/team/${team.identifier}/all`,
              activePaths: [`/${workspace.slug}/issue/${team.identifier}-`],
            },
            {
              title: 'Views',
              icon: StackLine,
              href: `/${workspace.slug}/team/${team.identifier}/views`,
            },
          ];

          if (team.preferences.cyclesEnabled) {
            links.push({
              title: 'Cycles',
              icon: Cycle,
              href: `/${workspace.slug}/team/${team.identifier}/cycles`,
            });
          }

          if (team.preferences.triage) {
            links = [
              {
                title: 'Triage',
                icon: TriageLine,
                href: `/${workspace.slug}/team/${team.identifier}/triage`,
              },
              ...links,
            ];
          }

          return (
            <AccordionItem
              value={team.id}
              key={team.identifier}
              className="mb-1"
            >
              <AccordionTrigger className="flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 w-fit rounded-md min-w-0">
                <div className="w-full justify-start flex items-center gap-1">
                  <div>
                    <TeamIcon name={team.name} />
                  </div>

                  <div className="flex justify-center items-center gap-1 min-w-0">
                    <Tooltip>
                      <TooltipTrigger className="truncate">
                        {team?.name}
                      </TooltipTrigger>

                      <TooltipContent className="p-2">
                        <p className="text-xs">{team?.name}</p>
                      </TooltipContent>
                    </Tooltip>
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col justify-center items-start w-full my-2">
                <Nav links={links} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
});
