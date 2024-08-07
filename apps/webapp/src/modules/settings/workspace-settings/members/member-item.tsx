import { AvatarText } from '@tegonhq/ui/components/avatar';
import { cn } from '@tegonhq/ui/lib/utils';

interface MemberItemProps {
  className: string;
  name: string;
  email: string;
}

export function MemberItem({ name, className, email }: MemberItemProps) {
  return (
    <div
      className={cn(
        className,
        'flex items-center justify-between bg-background-3 p-3 rounded-lg',
      )}
    >
      <div className="flex gap-2 items-center">
        <AvatarText text={name} className="text-base w-8 h-8 rounded-md" />

        <div className="flex flex-col">
          <div>{name}</div>
          <div className="text-muted-foreground">{email}</div>
        </div>
      </div>

      <div className="text-sm"> Admin </div>
    </div>
  );
}
