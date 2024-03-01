/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiApps2Fill,
  RiArrowRightSFill,
  RiStackFill,
  RiSwapLine,
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
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

import { useTeamStore } from 'store/team';

import { Nav } from './nav';

interface TeamListProps {
  isCollapsed?: boolean;
}

export const TeamList = observer(({ isCollapsed }: TeamListProps) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const teamStore = useTeamStore();

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
                    <RiTeamFill
                      size={18}
                      className="text-slate-500 dark:text-muted-foreground p-[2px] rounded-md"
                    />

                    <div className="flex justify-start items-center text-sm ml-3">
                      {team?.name}
                      <RiArrowRightSFill className="arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col justify-center items-start w-full">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-sm flex justify-start px-5"
                  >
                    <RiSwapLine className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    Triage
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-sm flex justify-start px-5"
                  >
                    <RiStackFill className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    Issues
                  </Button>

                  <div className="pl-8 w-full py-1">
                    <div className="border-l pl-3 w-full">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-sm flex justify-start px-2"
                      >
                        Active
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-sm flex justify-start px-2"
                      >
                        Backlog
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-sm flex justify-start px-5"
                  >
                    <RiApps2Fill className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    Projects
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </>
      )}
    </div>
  );
});
