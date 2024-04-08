/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { WorkflowType } from 'common/types/team';

import { ScrollArea } from 'components/ui/scroll-area';

import { CategoryViewItem } from './category-view-item';

interface CategoryListProps {
  workflows: WorkflowType[];
}

export function CategoryList({ workflows }: CategoryListProps) {
  return (
    <ScrollArea className="w-full h-full">
      {workflows.map((workflow: WorkflowType) => (
        <CategoryViewItem key={workflow.id} workflow={workflow} />
      ))}
    </ScrollArea>
  );
}
