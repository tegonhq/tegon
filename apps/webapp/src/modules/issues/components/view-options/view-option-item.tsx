import { Switch } from '@tegonhq/ui/components/switch';

interface ViewOptionItemProps {
  id: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  text: string;
}

export function ViewOptionItem({
  id,
  checked,
  onCheckedChange,
  text,
}: ViewOptionItemProps) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center">
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      <div>{text}</div>
    </div>
  );
}
