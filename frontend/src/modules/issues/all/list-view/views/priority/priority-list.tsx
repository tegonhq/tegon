import { Priorities } from 'common/types/issue';

import { ScrollArea } from 'components/ui/scroll-area';

import { PriorityViewList } from './priority-view-list';

export function PriorityList() {
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {Priorities.map((priority: string, index: number) => (
          <PriorityViewList key={priority} priority={index} />
        ))}
      </div>
    </ScrollArea>
  );
}
