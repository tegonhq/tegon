/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAccountBoxFill,
  RiArrowRightSFill,
  RiExchangeFill,
  RiFunctionFill,
  RiStackFill,
  RiTeamFill,
} from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { TeamType } from 'common/types/team';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import { Separator } from 'components/ui/separator';
import { useTeamsStore } from 'hooks/teams';

import { Nav } from './nav';
import { TeamListItem } from './team-list-item';

interface TeamListProps {
  isCollapsed?: boolean;
}

export const TeamList = observer(({ isCollapsed }: TeamListProps) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const teamStore = useTeamsStore();

  return (
    <div
      ref={containerRef}
      className="h-full space-y-1 overflow-y-auto mt-4 m-2"
    >
      {isCollapsed ? (
        <Separator />
      ) : (
        <div className="px-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
          Your teams
        </div>
      )}

      {isCollapsed && (
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: 'Poozle',
              icon: RiTeamFill,
              href: '/poozle',
            },
          ]}
        />
      )}

      {!isCollapsed && (
        <>
          {teamStore.teams.map((team: TeamType) => (
            <Accordion
              type="single"
              key={team.identifier}
              collapsible
              defaultValue="item-1"
              className="w-full text-slate-700 dark:text-slate-300 mt-0"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm py-1 flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 rounded-md">
                  <div className="w-full justify-start px-3 flex items-center">
                    <RiAccountBoxFill
                      size={16}
                      className="shrink-0 text-muted-foreground h-4 w-4"
                    />

                    <div className="flex justify-start items-center text-sm ml-3">
                      {team?.name}
                      <RiArrowRightSFill className="arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col justify-center items-start w-full mt-1">
                  <TeamListItem
                    name="Triage"
                    team={team}
                    Icon={RiExchangeFill}
                    href="triage"
                  />
                  <TeamListItem
                    name="Issues"
                    team={team}
                    Icon={RiStackFill}
                    href="all"
                  />

                  <div className="pl-[2rem] w-full">
                    <div className="border-l-1 pl-4 w-full">
                      <TeamListItem
                        subList
                        name="Active"
                        team={team}
                        href="active"
                      />
                      <TeamListItem
                        subList
                        name="Backlog"
                        team={team}
                        href="backlog"
                      />
                    </div>
                  </div>
                  <TeamListItem
                    name="Projects"
                    team={team}
                    href="projects"
                    Icon={RiFunctionFill}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </>
      )}
    </div>
  );
});
