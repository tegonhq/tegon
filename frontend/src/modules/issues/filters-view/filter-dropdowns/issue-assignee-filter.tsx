import { observer } from 'mobx-react-lite';

import { IssueAssigneeDropdownContent } from 'modules/issues/components';

import { useUsersData } from 'hooks/users';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueAssigneeFilterProps {
  onChange?: (assigneeId: string[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssueAssigneeFilter = observer(
  ({ onChange, onClose }: IssueAssigneeFilterProps) => {
    const { usersData } = useUsersData();
    const { applicationStore } = useContextStore();

    const assigneeFilters = applicationStore.filters.assignee
      ? applicationStore.filters.assignee.value
      : [];

    const change = (value: string[]) => {
      onChange(value, FilterTypeEnum.IS);
    };

    return (
      <IssueAssigneeDropdownContent
        onChange={change}
        onClose={onClose}
        usersData={usersData}
        value={assigneeFilters}
        multiple
      />
    );
  },
);
