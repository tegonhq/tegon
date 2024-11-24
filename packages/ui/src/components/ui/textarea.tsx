import * as React from 'react';

import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textAreaRef = React.useRef<any>(ref);
    const id = React.useMemo(() => {
      return `id${Math.random().toString(16).slice(2)}`;
    }, []);

    return (
      <textarea
        className={cn(
          'flex min-h-[30px] w-full rounded bg-input px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        id={id}
        ref={textAreaRef}
        value={value}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
