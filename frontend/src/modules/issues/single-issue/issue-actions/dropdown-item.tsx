/** Copyright (c) 2024, Tegon, all rights reserved. **/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DropdownItem({ Icon, title }: { Icon: any; title: string }) {
  return (
    <div className="flex gap-2 items-center hover:text-foreground mr-2">
      <Icon size={16} />
      <span className="text-foreground">{title}</span>
    </div>
  );
}
