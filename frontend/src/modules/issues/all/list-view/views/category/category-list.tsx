/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { WorkflowType } from 'common/types/team';

import { ScrollArea } from 'components/ui/scroll-area';

import { CategoryViewList } from './category-view-list';

interface CategoryListProps {
  workflows: WorkflowType[];
}

export function CategoryList({ workflows }: CategoryListProps) {
  return (
    <ScrollArea className="w-full h-full">
      {workflows.map((workflow: WorkflowType) => (
        <CategoryViewList key={workflow.id} workflow={workflow} />
      ))}
    </ScrollArea>
  );
}
