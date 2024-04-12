/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { CommandItem } from 'components/ui/command';

interface DropdownItemProps {
  id: string;
  onSelect: (value: string) => void;
  index: number;
  children: React.ReactElement;
}

export function DropdownItem({
  id,
  onSelect,

  children,
}: DropdownItemProps) {
  return (
    <CommandItem key={id} value={id} onSelect={onSelect}>
      <div className="flex w-full">
        <div className="grow">{children}</div>
      </div>
    </CommandItem>
  );
}
