import { observer } from 'mobx-react-lite';

import { IssueAssigneeDropdownContent } from 'modules/issues/components';

import { useUsersData } from 'hooks/users';

interface IssueAssigneeDropdownWithoutContextProps {
  onChange?: (assigneeId: string | string[]) => void;
  onClose: () => void;
  value: string;
}

export const IssueAssigneeDropdownWithoutContext = observer(
  ({ onChange, onClose, value }: IssueAssigneeDropdownWithoutContextProps) => {
    const { users } = useUsersData();

    return (
      <IssueAssigneeDropdownContent
        onChange={onChange}
        onClose={onClose}
        users={users}
        value={value}
      />
    );
  },
);
