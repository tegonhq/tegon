import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ContentBox } from './content-box';

interface MainLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = observer(
  ({ header, children, className }: MainLayoutProps) => {
    return (
      <main className={cn('flex flex-col h-[100vh]', className)}>
        <ContentBox>
          {header}
          {children}
        </ContentBox>
      </main>
    );
  },
);
