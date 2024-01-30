/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiApps2Fill,
  RiArrowRightSFill,
  RiStackFill,
  RiSwapLine,
  RiTeamFill,
} from '@remixicon/react';
import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

import { Nav } from './nav';

// import { TeamSettingsDropdown } from './team-settings-dropdown';

interface TeamListProps {
  isCollapsed?: boolean;
}

export function TeamList({ isCollapsed }: TeamListProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="h-full space-y-2 overflow-y-auto mt-4 m-2"
    >
      {isCollapsed ? (
        <Separator />
      ) : (
        <div className="px-3 text-xs text-muted-foreground font-medium">
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
              variant: 'ghost',
            },
          ]}
        />
      )}

      {!isCollapsed && (
        <Accordion
          type="single"
          collapsible={false}
          defaultValue="item-1"
          className="w-full"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm py-1 flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-50 rounded-md">
              <div className="w-full justify-start px-3 flex items-center">
                <RiTeamFill size={16} className="text-blue-500" />

                <div className="flex justify-start items-center text-sm ml-3">
                  Poozle
                  <RiArrowRightSFill className="arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </div>
              </div>

              {/* <div>
              <TeamSettingsDropdown />
            </div> */}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col justify-center items-start w-full">
              <Button
                size="xs"
                variant="ghost"
                className="w-full text-sm flex justify-start px-5 mt-1"
              >
                <RiSwapLine className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                Triage
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className="w-full text-sm flex justify-start px-5 mt-1"
              >
                <RiStackFill className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                Issues
              </Button>

              <div className="pl-8 w-full">
                <div className="border-l pl-3 w-full">
                  <Button
                    size="xs"
                    variant="ghost"
                    className="w-full text-sm flex justify-start mt-1 px-2"
                  >
                    Active
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="w-full text-sm flex justify-start mt-1 px-2"
                  >
                    Backlog
                  </Button>
                </div>
              </div>
              <Button
                size="xs"
                variant="ghost"
                className="w-full text-sm flex justify-start px-5 mt-1"
              >
                <RiApps2Fill className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                Projects
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
