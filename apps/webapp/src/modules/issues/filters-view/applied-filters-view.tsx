import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useContextStore } from 'store/global-context-provider';

import {
  IssueStatusDropdown,
  IssueAssigneeDropdown,
  IssueLabelDropdown,
  IssuePriorityDropdown,
  IssueProjectDropdown,
  IssueCycleDropdown,
} from './filter-dropdowns';
import { FilterItemView } from './filter-item-view';
import { isEmpty } from './filter-utils';

export const AppliedFiltersView = observer(() => {
  const { applicationStore } = useContextStore();
  const filters = applicationStore.filters;

  return (
    <>
      {!isEmpty(filters) && (
        <div
          className="flex gap-1 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <FilterItemView
            name="Status"
            filterKey="status"
            filter={filters.status}
            Component={IssueStatusDropdown}
          />

          <FilterItemView
            name="Assignee"
            filterKey="assignee"
            filter={filters.assignee}
            Component={IssueAssigneeDropdown}
          />

          <FilterItemView
            name="Label"
            filterKey="label"
            filter={filters.label}
            isArray
            Component={IssueLabelDropdown}
          />

          <FilterItemView
            name="Priority"
            filterKey="priority"
            filter={filters.priority}
            Component={IssuePriorityDropdown}
          />

          <FilterItemView
            name="Cycle"
            filterKey="cycle"
            filter={filters.cycle}
            Component={IssueCycleDropdown}
          />

          <FilterItemView
            name="Project"
            filterKey="project"
            filter={filters.project}
            Component={IssueProjectDropdown}
          />

          <FilterItemView
            name="Parent issues"
            filterKey="isParent"
            filter={filters.isParent}
            Component={() => <>parent</>}
          />

          <FilterItemView
            name="Sub issues"
            filterKey="isSubIssue"
            filter={filters.isSubIssue}
            Component={() => <>sub-issue</>}
          />

          <FilterItemView
            name="Blocked issues"
            filterKey="isBlocked"
            filter={filters.isBlocked}
            Component={() => <>blocked</>}
          />

          <FilterItemView
            name="Blocking issues"
            filterKey="isBlocking"
            filter={filters.isBlocking}
            Component={() => <>blocking</>}
          />
        </div>
      )}
    </>
  );
});
