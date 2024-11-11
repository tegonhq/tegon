'use client';

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '../../lib/utils';

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  orientation?: 'horizontal' | 'vertical';
  id?: string;
}

// Add this custom hook above the ScrollArea component
function useScrollRestoration(
  id: string | undefined,
  ref: React.RefObject<HTMLDivElement>,
) {
  React.useEffect(() => {
    if (!id || !ref.current) {
      return null;
    }
    const element = ref.current;

    // Initialize window storage if it doesn't exist
    if (!(window as any).__scrollPositions) {
      (window as any).__scrollPositions = {};
    }

    // Restore scroll position on mount
    const savedPosition = (window as any).__scrollPositions[id];
    if (savedPosition) {
      const { scrollTop, scrollLeft } = savedPosition;
      element.scrollTop = scrollTop;
      element.scrollLeft = scrollLeft;
    }

    // Add scroll event listener to save position while scrolling
    const handleScroll = () => {
      (window as any).__scrollPositions[id] = {
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft,
      };
    };

    element.addEventListener('scroll', handleScroll);

    // Cleanup: remove event listener and save final position
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [id, ref]);
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, orientation = 'vertical', id, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  useScrollRestoration(id, viewportRef);

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="h-full w-full rounded-[inherit] scroll-area"
        id={id}
        ref={viewportRef}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation={orientation} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
