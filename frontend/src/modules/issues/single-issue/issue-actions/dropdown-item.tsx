// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DropdownItem({ Icon, title }: { Icon: any; title: string }) {
  return (
    <div className="flex gap-2 items-center mr-2">
      <Icon size={16} />
      <span>{title}</span>
    </div>
  );
}
