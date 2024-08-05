import type { WorkflowType } from 'common/types';

import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import { CategoryViewList } from './category-view-list';

interface CategoryListProps {
  workflows: WorkflowType[];
}

export function CategoryList({ workflows }: CategoryListProps) {
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {workflows.map((workflow: WorkflowType) => (
          <CategoryViewList key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </ScrollArea>
  );
}
