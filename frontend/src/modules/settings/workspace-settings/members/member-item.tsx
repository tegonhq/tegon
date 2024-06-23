/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { cn } from 'common/lib/utils';

import { AvatarText } from 'components/ui/avatar';

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
        'flex items-center justify-between bg-gray-50 p-3 rounded-lg',
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
