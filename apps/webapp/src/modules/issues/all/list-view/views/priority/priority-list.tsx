import { Priorities } from '@tegonhq/types';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

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
