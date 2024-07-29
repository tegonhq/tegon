import type { User } from '@tegonhq/types';
import type { IssueType } from '@tegonhq/types';

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@tegonhq/ui/components/avatar';
import { getInitials } from '@tegonhq/ui/components/avatar';
import { Loader } from '@tegonhq/ui/components/loader';
import { cn } from '@tegonhq/ui/lib/utils';

import { getTailwindColor } from 'common/color-utils';
import { groupBy } from 'common/lib/common';

import { useUsersData } from 'hooks/users';

interface AssigneeInsightsProps {
  issues: IssueType[];
}

export function AssigneeInsights({ issues }: AssigneeInsightsProps) {
  const { usersData, isLoading } = useUsersData();
  const groupedByIssues = groupBy(issues, 'assigneeId');

  if (isLoading) {
    return <Loader />;
  }

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }
  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from(groupedByIssues.keys()).map((key: string) => {
        const user = getUserData(key);

        if (!user) {
          return null;
        }

        return (
          <div key={key} className="flex justify-between py-1">
            <div className="text-xs flex gap-2 items-center">
              <Avatar className="h-[15px] w-[20px] flex items-center">
                <AvatarImage />
                <AvatarFallback
                  className={cn(
                    'text-[0.55rem] rounded-sm',
                    getTailwindColor(user?.username),
                  )}
                >
                  {getInitials(user?.fullname)}
                </AvatarFallback>
              </Avatar>
              {user?.fullname}
            </div>

            <div className="text-xs text-muted-foreground">
              {groupedByIssues.get(key).length}
            </div>
          </div>
        );
      })}
    </div>
  );
}
