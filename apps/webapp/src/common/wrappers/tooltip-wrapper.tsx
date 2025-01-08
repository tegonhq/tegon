import type { ReactNode } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tegonhq/ui/components/tooltip';
import { cn } from '@tegonhq/ui/lib/utils';

interface TooltipWrapperProps {
  tooltip: string;
  children: ReactNode;
  className?: string;
  tooltipClassName?: string;
  disabled?: boolean;
}

export function TooltipWrapper({
  tooltip,
  children,
  tooltipClassName,
  disabled = false,
}: TooltipWrapperProps) {
  // If no tooltip is provided or wrapper is disabled, return just the children
  if (!tooltip || disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={cn('p-2', tooltipClassName)}>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
}
