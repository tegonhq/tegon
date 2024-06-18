/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

import { FilterDropdown } from './filter-dropdown';
import { IssueAssigneeDropdown } from './filter-dropdowns/issue-assignee-dropdown';
import { IssueLabelDropdown } from './filter-dropdowns/issue-label-dropdown';
import { IssuePriorityDropdown } from './filter-dropdowns/issue-priority-dropdown';
import { IssueStatusDropdown } from './filter-dropdowns/issue-status-dropdown';
import { FilterItemView } from './filter-item-view';

interface FilterViewProps {
  Actions?: React.ReactElement;
  showStatus?: boolean;
}

export const FiltersView = observer(
  ({ Actions, showStatus = true }: FilterViewProps) => {
    const { applicationStore } = useContextStore();
    const filters = applicationStore.filters;

    return (
      <div className="py-3 pt-6 pl-6 px-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2 flex-wrap">
            <FilterDropdown showStatus={showStatus} />
          </div>

          <div>{Actions}</div>
        </div>

        <div className="flex justify-start gap-2 flex-wrap">
          {/* Status  */}
          {showStatus && filters.status && (
            <FilterItemView
              name="Status"
              filterKey="status"
              value={filters.status.value}
              filterType={filters.status.filterType}
              Component={IssueStatusDropdown}
            />
          )}

          {/* Assignee  */}
          {filters.assignee && (
            <FilterItemView
              name="Assignee"
              filterKey="assignee"
              value={filters.assignee.value}
              filterType={filters.assignee.filterType}
              Component={IssueAssigneeDropdown}
            />
          )}

          {/* Label  */}
          {filters['label'] && (
            <FilterItemView
              name="Label"
              filterKey="label"
              value={filters.label.value}
              filterType={filters.label.filterType}
              isArray
              Component={IssueLabelDropdown}
            />
          )}

          {/* Label  */}
          {filters['priority'] && (
            <FilterItemView
              name="Priority"
              filterKey="priority"
              value={filters.priority.value}
              filterType={filters.priority.filterType}
              Component={IssuePriorityDropdown}
            />
          )}

          {filters['isParent'] && (
            <FilterItemView
              name="Parent issues"
              filterKey="isParent"
              value={filters.isParent.value}
              filterType={filters.isParent.filterType}
              Component={() => <>parent</>}
            />
          )}

          {filters['isSubIssue'] && (
            <FilterItemView
              name="Sub issues"
              filterKey="isSubIssue"
              value={filters.isSubIssue.value}
              filterType={filters.isSubIssue.filterType}
              Component={() => <>sub-issue</>}
            />
          )}

          {filters['isBlocked'] && (
            <FilterItemView
              name="Blocked issues"
              filterKey="isBlocked"
              value={filters.isBlocked.value}
              filterType={filters.isBlocked.filterType}
              Component={() => <>blocked</>}
            />
          )}

          {filters['isBlocking'] && (
            <FilterItemView
              name="Blocking issues"
              filterKey="isBlocking"
              value={filters.isBlocking.value}
              filterType={filters.isBlocking.filterType}
              Component={() => <>blocking</>}
            />
          )}
        </div>
      </div>
    );
  },
);
