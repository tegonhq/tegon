/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Priorities } from 'common/types/issue';

import { ScrollArea } from 'components/ui/scroll-area';

import { PriorityViewList } from './priority-view-list';

export function PriorityList() {
  return (
    <ScrollArea className="w-full h-full">
      {Priorities.map((priority: string, index: number) => (
        <PriorityViewList key={priority} priority={index} />
      ))}
    </ScrollArea>
  );
}
