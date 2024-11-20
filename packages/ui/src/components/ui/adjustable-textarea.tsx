import React, { useEffect, useRef } from 'react';

import { cn } from '../../lib/utils';

interface AdjustableTextareaProps {
  className?: string;
  onChange: (text: string) => void;
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AdjustableTextArea = ({
  className,
  onChange,
  value,
  placeholder,
  autoFocus,
}: AdjustableTextareaProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.textContent || '');
  };

  // Update div content when state changes (sets the value)
  useEffect(() => {
    if (divRef.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
    }
  }, [value]);

  // Set focus on the div when autoFocus is true
  useEffect(() => {
    if (autoFocus && divRef.current) {
      divRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative w-full">
      <span
        className={`absolute z-1 left-0 top-0 text-muted-foreground ${value ? 'hidden' : ''}`} // Placeholder styling
      >
        {placeholder}
      </span>
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          className,
          'w-full z-10 relative rounded-md resize-none overflow-hidden whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500',
        )}
        onInput={handleInput}
      />
    </div>
  );
};
