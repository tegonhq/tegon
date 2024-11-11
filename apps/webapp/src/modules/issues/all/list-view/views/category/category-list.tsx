import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import type { WorkflowType } from 'common/types';

import { CategoryViewList } from './category-view-list';

interface CategoryListProps {
  workflows: WorkflowType[];
}

export function CategoryList({ workflows }: CategoryListProps) {
  return (
    <ScrollArea className="w-full h-full" id="category-list">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {workflows.map((workflow: WorkflowType) => (
          <CategoryViewList
            key={workflow.name}
            workflow={workflow}
            workflows={workflows}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
