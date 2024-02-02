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

interface TeamListProps {
  isCollapsed?: boolean;
}

export function TeamList({ isCollapsed }: TeamListProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="h-full space-y-1 overflow-y-auto mt-4 m-2"
    >
      {isCollapsed ? (
        <Separator />
      ) : (
        <div className="px-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
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
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="w-full text-gray-700 dark:text-gray-300 mt-0"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm py-1 flex justify-between [&[data-state=open]>div>div>svg]:rotate-90 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 rounded-md">
              <div className="w-full justify-start px-3 flex items-center">
                <RiTeamFill
                  size={18}
                  className="text-gray-500 dark:text-muted-foreground dark:bg-gray-800 bg-gray-100 p-[2px] rounded-md"
                />

                <div className="flex justify-start items-center text-sm ml-3">
                  Poozle
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

              <div className="pl-8 w-full">
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
      )}
    </div>
  );
}
