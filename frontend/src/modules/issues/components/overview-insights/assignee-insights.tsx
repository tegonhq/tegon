/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { getTailwindColor } from 'common/color-utils';
import { groupBy } from 'common/lib/common';
import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';

import { Avatar, AvatarImage, AvatarFallback } from 'components/ui/avatar';
import { getInitials } from 'components/ui/avatar';
import { Loader } from 'components/ui/loader';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

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
