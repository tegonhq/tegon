/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { LinkedIssueType } from 'common/types/linked-issue';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import ReactTimeAgo from 'react-time-ago';

interface LinkedIssueActivityProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueActivity({ linkedIssue }: LinkedIssueActivityProps) {
  console.log(linkedIssue);

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Avatar className="h-[20px] w-[25px] mr-4 text-foreground">
        <AvatarImage />
        <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm">
          Ha
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center">
        <span className="text-foreground mr-2 font-medium"></span>
        created the issue
      </div>
      <div className="mx-1">-</div>

      <div>
        <ReactTimeAgo date={new Date(linkedIssue.createdAt)} />
      </div>
    </div>
  );
}
