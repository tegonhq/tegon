import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';
import { AssigneeLine } from '@tegonhq/ui/icons';

import type { User } from 'common/types';
import { getUserFromUsersData } from 'common/user-util';

import { useScope } from 'hooks';

import { DropdownItem } from '../dropdown-item';

interface IssueAssigneeDropdownContentProps {
  onChange?: (assigneeId: string | string[]) => void;
  users: User[];
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export function IssueAssigneeDropdownContent({
  onChange,
  users,
  onClose,
  multiple = false,
  value,
}: IssueAssigneeDropdownContentProps) {
  useScope('command');

  const onValueChange = (checked: boolean, id: string) => {
    if (checked && !value.includes(id)) {
      onChange && onChange([...value, id]);
    }

    if (!checked && value.includes(id)) {
      const newIds = [...value];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

  return (
    <CommandGroup>
      <DropdownItem
        id="no-user"
        value="No Assignee"
        index={0}
        onSelect={() => {
          if (!multiple) {
            onChange && onChange(null);
            onClose();
          } else {
            onValueChange(!value.includes('no-user'), 'no-user');
          }
        }}
      >
        <div className="flex gap-2 items-center">
          {multiple && (
            <Checkbox
              id="no-user"
              checked={value.includes('no-user')}
              onCheckedChange={(value: boolean) =>
                onValueChange(value, 'no-user')
              }
            />
          )}
          <div className="flex grow">
            <AssigneeLine size={20} className="mr-2" />
            No Assignee
          </div>
        </div>
      </DropdownItem>
      {users.map((user: User, index: number) => {
        const userData = getUserFromUsersData(users, user.id);

        return (
          <DropdownItem
            key={user.id}
            id={user.id}
            value={user.fullname}
            index={index + 1}
            onSelect={(currentValue: string) => {
              if (!multiple) {
                onChange && onChange(currentValue);
                onClose();
              } else {
                onValueChange(!value.includes(currentValue), user.id);
              }
            }}
          >
            <div className="flex gap-2 items-center">
              {multiple && (
                <Checkbox
                  id={userData.id}
                  checked={value.includes(user.id)}
                  onCheckedChange={(value: boolean) => {
                    onValueChange(value, user.id);
                  }}
                />
              )}
              <label
                htmlFor={multiple ? userData.id : undefined}
                className="flex gap-2 grow"
              >
                <AvatarText
                  text={userData.fullname}
                  className="h-5 w-5 text-[9px]"
                />

                {userData.fullname}
              </label>
            </div>
          </DropdownItem>
        );
      })}
    </CommandGroup>
  );
}
