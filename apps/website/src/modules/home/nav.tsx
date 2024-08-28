'use client';

import { ScrollArea, ScrollBar } from '@tegonhq/ui/components/scroll-area';
import { Button } from '@tegonhq/ui/components/button';
import { Actions, AI, IssuesLine, TriageFill } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';

const tabs = [
  {
    name: 'Issue tracker',
    Icon: IssuesLine,
  },
  {
    name: 'Triage',
    Icon: TriageFill,
    color: 'var(--status-icon-0)',
  },
  {
    name: 'Actions',
    Icon: Actions,
  },
  {
    name: 'AI',
    Icon: AI,
  },
];

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  tab: string;
  setTab: (tab: string) => void;
}

export function Nav({
  className,
  tab: currentTab,
  setTab,
  ...props
}: NavProps) {
  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div
          className={cn('mb-4 flex items-center gap-2', className)}
          {...props}
        >
          {tabs.map((tab) => {
            const Icon = tab.Icon;

            return (
              <Button
                key={tab.name}
                isActive={currentTab === tab.name}
                variant="secondary"
                size="lg"
                onClick={() => setTab(tab.name)}
                className="flex gap-2"
              >
                <Icon size={20} color={tab.color} />
                {tab.name}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
