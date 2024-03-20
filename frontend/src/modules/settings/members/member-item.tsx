/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { cn } from 'common/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';

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
        'flex items-center justify-between border-b pb-4',
      )}
    >
      <div className="flex gap-4">
        <Avatar className="w-[40px] ">
          <AvatarImage />
          <AvatarFallback className="bg-cyan-500 dark:bg-cyan-900 text-[0.6rem] rounded-sm">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col text-sm">
          <div>{name}</div>
          <div className="text-muted-foreground">{email}</div>
        </div>
      </div>

      <div className="text-sm"> Admin </div>
    </div>
  );
}
