/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { IssueAssigneeDropdownContent } from 'modules/issues/components';

import { useApplicationStore } from 'hooks/use-application-store';
import { useUsersData } from 'hooks/users';

interface IssueAssigneeFilterProps {
  onChange?: (assigneeId: string) => void;
  onClose: () => void;
}

export const IssueAssigneeFilter = observer(
  ({ onChange, onClose }: IssueAssigneeFilterProps) => {
    const { usersData } = useUsersData();
    const applicationStore = useApplicationStore();

    const assigneeFilters = JSON.parse(applicationStore.filters).assignee ?? [];

    return (
      <IssueAssigneeDropdownContent
        onChange={onChange}
        onClose={onClose}
        usersData={usersData}
        value={assigneeFilters}
        multiple
      />
    );
  },
);
