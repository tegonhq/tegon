import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import type { LabelType } from 'common/types';

import { LabelViewList, NoLabelList } from './label-view-list';

interface LabelListProps {
  labels: LabelType[];
}

export function LabelList({ labels }: LabelListProps) {
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {labels.map((label: LabelType) => (
          <LabelViewList key={label.id} label={label} />
        ))}
        <NoLabelList />
      </div>
    </ScrollArea>
  );
}
