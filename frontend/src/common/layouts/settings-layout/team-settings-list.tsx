/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiArrowRightSFill, RiTeamFill } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { cn } from 'common/lib/utils';
import type { TeamType } from 'common/types/team';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import { buttonVariants } from 'components/ui/button';
import { useTeamsStore } from 'hooks/teams';

import { TEAM_LINKS } from './settings-layout-constants';

export const TeamSettingsList = observer(() => {
  const teamStore = useTeamsStore();
  const { query } = useRouter();
  const { workspaceSlug, settingsSection, teamIdentifier } = query;

  return (
    <div className="px-4 py-3">
      <div className="flex flex-col items-start justify-start w-full">
        <div className="flex items-center mb-2">
          <RiTeamFill size={18} className="text-muted-foreground" />
          <div className="text-muted-foreground text-sm ml-4">Teams</div>
        </div>

        <div className="flex flex-col w-full">
          {teamStore.teams.map((team: TeamType) => (
            <Accordion
              type="single"
              collapsible
              key={team.identifier}
              defaultValue="item-1"
              className="w-full text-gray-700 dark:text-gray-300 mt-0"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm py-1 flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 rounded-md">
                  <div className="w-full justify-start flex items-center">
                    <div className="flex justify-start items-center text-sm">
                      <RiArrowRightSFill className="arrow-right-icon mx-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                      {team.name}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 flex flex-col justify-center items-start w-full">
                  {TEAM_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${workspaceSlug}/settings/teams/${team.identifier}/${item.href}`}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),

                        'justify-start text-sm w-full px-2 !text-muted-foreground mt-1',
                        team.identifier === teamIdentifier &&
                          settingsSection === item.href &&
                          'bg-gray-100 dark:bg-gray-800',
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
});
