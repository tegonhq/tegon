/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { CommandItem } from 'components/ui/command';

interface DropdownItemProps {
  id: string;
  value: string;
  onSelect: (value: string) => void;
  index: number;
  children: React.ReactElement;
}

export function DropdownItem({
  id,
  value,
  onSelect,
  children,
}: DropdownItemProps) {
  return (
    <CommandItem key={id} value={value} onSelect={() => onSelect(id)}>
      <div className="flex w-full">
        <div className="grow">{children}</div>
      </div>
    </CommandItem>
  );
}
