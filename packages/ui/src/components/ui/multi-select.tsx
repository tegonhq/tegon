'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { Close } from '@tegonhq/ui/icons';

import { Badge } from './badge';
import { Command, CommandGroup, CommandItem, CommandList } from './command';

type Option = Record<'value' | 'label', string>;

interface MultiSelectProps {
  options: Option[];
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({
  options,
  placeholder,
  onChange,
  value,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleUnselect = (option: Option) => {
    onChange(value.filter((s) => s !== option.value));
  };

  const handleSelect = (selectedValue: string) => {
    let newSelected: string[];

    if (value.includes(selectedValue)) {
      newSelected = value.filter((optValue) => optValue !== selectedValue);
    } else {
      newSelected = [...value, selectedValue];
    }

    onChange(newSelected);
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            const newSelected = [...value];
            newSelected.pop();
            onChange(newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div
        className="group rounded-md bg-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex items-center"
        style={{ minHeight: '32px' }}
      >
        <div className="flex flex-wrap gap-1 h-full items-center px-1 my-1">
          {value.map((val) => {
            const option = options.find((op) => op.value === val);

            return (
              <Badge key={option.value} variant="secondary" className="h-6">
                {option.label}
                <button
                  className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <Close className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative">
        <CommandList>
          {open && options.length > 0 ? (
            <div className="mt-2 absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue('');
                        handleSelect(option.value);
                      }}
                      className="cursor-pointer flex gap-1 items-center"
                    >
                      <div className="h-4 w-4 flex gap-1 items-center">
                        {value.includes(option.value) && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
