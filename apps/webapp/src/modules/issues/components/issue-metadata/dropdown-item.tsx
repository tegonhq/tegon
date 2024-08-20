import { CommandItem } from '@tegonhq/ui/components/command';

interface DropdownItemProps {
  id: string | number;
  value: string;
  onSelect: (value: string | number) => void;
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
