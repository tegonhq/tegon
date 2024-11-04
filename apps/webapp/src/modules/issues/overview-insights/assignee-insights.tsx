import { RoleEnum } from '@tegonhq/types';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { AssigneeLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { groupBy } from 'common/lib/common';
import { FilterTypeEnum, type IssueType } from 'common/types';
import type { User, UsersOnWorkspaceType } from 'common/types';

import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { applyFilters } from './utils';

interface AssigneeInsightsProps {
  issues: IssueType[];
}

export const AssigneeInsights = observer(
  ({ issues }: AssigneeInsightsProps) => {
    const {
      workspaceStore: { usersOnWorkspaces },
    } = useContextStore();
    const { users, isLoading } = useUsersData();
    const { applicationStore } = useContextStore();
    const groupedByIssues = groupBy(issues, 'assigneeId');

    if (isLoading) {
      return <Loader />;
    }

    function getUserData(userId: string) {
      return users.find((userData: User) => userData.id === userId);
    }

    const assigneeFilter = applicationStore.filters.assignee
      ? applicationStore.filters.assignee.value
      : [];

    return (
      <div className="flex flex-col gap-1">
        {usersOnWorkspaces
          .filter(
            (uOw: UsersOnWorkspaceType) =>
              ![RoleEnum.BOT, RoleEnum.AGENT].includes(uOw.role as RoleEnum),
          )
          .map((uOW: UsersOnWorkspaceType) => {
            const user = getUserData(uOW.userId);
            const isActive = assigneeFilter.includes(user.id);

            return (
              <Button
                key={user.id}
                className="flex justify-between p-3 h-auto group"
                variant="link"
                isActive={isActive}
                onClick={() =>
                  applyFilters(
                    FilterTypeEnum.IS,
                    'assignee',
                    user.id,
                    assigneeFilter,
                    applicationStore,
                  )
                }
              >
                <div className="flex gap-2 items-center">
                  <AvatarText text={user?.fullname} className="text-[9px]" />
                  {user?.fullname}
                </div>

                <div className="text-muted-foreground flex gap-2 items-center">
                  <span className="group-hover:block hidden">
                    {isActive ? 'Clear filter' : 'Apply filter'}
                  </span>
                  {groupedByIssues.get(user.id).length}
                </div>
              </Button>
            );
          })}
        <Button
          key="no-user"
          className="flex justify-between p-3 h-auto group"
          variant="link"
          isActive={assigneeFilter.includes('no-user')}
          onClick={() =>
            applyFilters(
              FilterTypeEnum.IS,
              'assignee',
              'no-user',
              assigneeFilter,
              applicationStore,
            )
          }
        >
          <div className="flex gap-2 items-center">
            <AssigneeLine />
            No user
          </div>

          <div className="text-muted-foreground flex gap-2 items-center">
            <span className="group-hover:block hidden">
              {assigneeFilter.includes('no-user')
                ? 'Clear filter'
                : 'Apply filter'}
            </span>
            {groupedByIssues.get(null).length}
          </div>
        </Button>
      </div>
    );
  },
);
