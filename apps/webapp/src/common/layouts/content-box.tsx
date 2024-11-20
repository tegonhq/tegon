import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

interface ContentBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentBox = observer(
  ({ children, className }: ContentBoxProps) => {
    const { applicationStore } = useContextStore();

    return (
      <main
        className={cn(
          'p-3 pt-0 pl-0 flex flex-col h-[calc(100vh_-_48px)]',
          applicationStore.sidebarCollapsed && 'pl-3',
          className,
        )}
      >
        <div className="bg-background-2 h-full rounded-lg overflow-hidden shadow flex flex-col">
          {children}
        </div>
      </main>
    );
  },
);
