/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAddLine } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { cn } from 'common/lib/utils';
import type { TeamType } from 'common/types/team';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import { buttonVariants } from 'components/ui/button';
import { TeamIcon } from 'components/ui/team-icon';
import { ChevronRight, TeamLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

import { TEAM_LINKS } from './settings-layout-constants';

export const TeamSettingsList = observer(() => {
  const currentUser = React.useContext(UserContext);
  const { teamsStore, workspaceStore } = useContextStore();

  const { query } = useRouter();
  const { workspaceSlug, settingsSection, teamIdentifier } = query;
  const teamAccessList = workspaceStore.getUserData(currentUser.id).teamIds;
  const teams = teamsStore.teams.filter((team: TeamType) =>
    teamAccessList.includes(team.id),
  );

  return (
    <div className="px-6 py-3">
      <div className="flex flex-col items-start justify-start w-full">
        <div className="flex items-center mb-2">
          <TeamLine size={20} />
          <div className="ml-1">Teams</div>
        </div>

        <div className="flex flex-col w-full">
          <Accordion
            type="single"
            collapsible
            defaultValue={teams[0].identifier}
            className="w-full flex flex-col gap-3"
          >
            {teams.map((team: TeamType) => (
              <AccordionItem key={team.identifier} value={team.identifier}>
                <AccordionTrigger className="flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 w-fit rounded">
                  <div className="w-full justify-start flex items-center gap-1">
                    <div>
                      <TeamIcon name={team.name} />
                    </div>

                    <div className="flex justify-center items-center gap-1">
                      {team?.name}
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col justify-center items-start w-full my-2 gap-0.5">
                  {TEAM_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${workspaceSlug}/settings/teams/${team.identifier}/${item.href}`}
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'flex items-center justify-start bg-grayAlpha-100 w-fit',

                        team.identifier === teamIdentifier &&
                          settingsSection === item.href &&
                          'bg-accent text-accent-foreground',
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Link
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex items-center justify-start my-2 w-full gap-2 px-0',
          )}
          href={`/${workspaceSlug}/settings/new_team`}
        >
          <RiAddLine size={18} />
          <div>Add team</div>
        </Link>
      </div>
    </div>
  );
});
