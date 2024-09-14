import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import React from 'react';

interface ColorPickerProps {
  children: React.ReactNode;
  onChange: (color: string) => void;
}

export function ColorPicker({ children, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-70">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
              <div
                className="w-6 h-6 rounded cursor-pointer"
                style={{ backgroundColor: `var(--status-icon-${num})` }}
                key={num}
                onClick={() => onChange(num.toString())}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
