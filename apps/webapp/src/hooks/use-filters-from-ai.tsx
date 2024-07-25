import { Priorities } from 'common/types/issue';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { useUsersData } from './users';

export const isBooleanFilters = [
  'isBlocked',
  'isBlocking',
  'isParent',
  'isSubIssue',
];

export const allKeys = [
  ...isBooleanFilters,
  'assignee',
  'status',
  'label',
  'priority',
];

export function useFiltersFromAI() {
  const { applicationStore, labelsStore, workflowsStore } = useContextStore();
  const { usersData } = useUsersData();

  const getValueIds = (key: string, value: string[]) => {
    switch (key) {
      case 'label': {
        return labelsStore.getLabelWithValues(value);
      }

      case 'assignee': {
        return value
          .map((name: string) => {
            const user = usersData.find((user: User) =>
              user.fullname.toLowerCase().includes(name.toLowerCase()),
            );

            return user?.id;
          })
          .filter(Boolean);
      }

      case 'priority': {
        return value
          .map((priority: string) => {
            const index = Priorities.indexOf(priority);

            return index < 0 ? undefined : index;
          })
          .filter(Boolean);
      }

      case 'status': {
        return workflowsStore.getWorkflowByNames(value);
      }

      default:
        return [];
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFilters = (filterData: any) => {
    const keys = Object.keys(filterData);

    keys.forEach((key: string) => {
      // Verify if the keys are according to the current filter support
      if (allKeys.includes(key)) {
        // If the filter is a boolean filter just add to the store
        if (isBooleanFilters.includes(key)) {
          applicationStore.updateFilters({
            [key]: { filterType: filterData[key].filterType },
          });

          // If it not a boolean filter
        } else {
          const value = getValueIds(key, filterData[key].value);

          if (value.length > 0) {
            const newValue = (
              applicationStore.filters[key]
                ? [...applicationStore.filters[key].value, ...value]
                : value
            ).filter((elem: string, index: number, self: string[]) => {
              return index === self.indexOf(elem);
            });

            applicationStore.updateFilters({
              [key]: {
                filterType: filterData[key].filterType,
                value: newValue,
              },
            });
          }
        }
      }
    });
  };

  return { setFilters };
}
