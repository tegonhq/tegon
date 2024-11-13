import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { AssigneeLine } from '@tegonhq/ui/icons';
import { sort } from 'fast-sort';
import { observer } from 'mobx-react-lite';

import { groupBy } from 'common/lib/common';
import { FilterTypeEnum, type IssueType } from 'common/types';
import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { applyFilters } from './utils';

interface AssigneeInsightsProps {
  issues: IssueType[];
}

export const AssigneeInsights = observer(
  ({ issues }: AssigneeInsightsProps) => {
    const { users, isLoading } = useUsersData(false);
    const { applicationStore } = useContextStore();
    const groupedByIssues = groupBy(issues, 'assigneeId');

    if (isLoading) {
      return <Loader />;
    }

    const assigneeFilter = applicationStore.filters.assignee
      ? applicationStore.filters.assignee.value
      : [];

    const sortedAssignees = sort(users).desc(
      (user: User) => groupedByIssues.get(user.id)?.length ?? 0,
    );

    return (
      <div className="flex flex-col px-4 gap-1 mt-2">
        {sortedAssignees.map((user: User) => {
          const isActive = assigneeFilter.includes(user.id);

          return (
            <Button
              key={user.id}
              className="flex justify-between p-2.5 h-auto group"
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
                {groupedByIssues.get(user.id)?.length ?? 0}
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
            {groupedByIssues.get(null)?.length ?? 0}
          </div>
        </Button>
      </div>
    );
  },
);
