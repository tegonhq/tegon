import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

interface ContentBoxProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export const ContentBox = observer(
  ({ children, className, innerClassName }: ContentBoxProps) => {
    const { applicationStore } = useContextStore();

    return (
      <main
        className={cn(
          'main-container p-3 pl-0 h-[calc(100vh)]',
          applicationStore.sidebarCollapsed && 'pl-3',
          className,
        )}
      >
        <div
          className={cn(
            'context-box bg-background-2 h-full rounded-lg overflow-hidden shadow',

            innerClassName,
          )}
        >
          {children}
        </div>
      </main>
    );
  },
);
