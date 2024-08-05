import type { LabelType } from 'common/types';

import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import { LabelListItem, NoLabelList } from './label-list-item';

interface LabelListViewProps {
  labels: LabelType[];
}

export function LabelListView({ labels }: LabelListViewProps) {
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {labels.map((label: LabelType) => (
          <LabelListItem key={label.id} label={label} />
        ))}
        <NoLabelList />
      </div>
    </ScrollArea>
  );
}
