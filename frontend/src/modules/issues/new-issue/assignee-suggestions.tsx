/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Button } from 'components/ui/button';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

interface AssigneeSuggestionsProps {
  userIds: string[];
  setAssigneeValue: (assigneeId: string) => void;
  assigneeId: string;
  teamId: string;
}

export function AssigneeSuggestions({
  setAssigneeValue,
  userIds,
  teamId,
}: AssigneeSuggestionsProps) {
  const { usersData, isLoading } = useUsersData(teamId);
  if (isLoading) {
    return null;
  }

  const usersToSuggest = usersData.filter((user: User) => {
    return userIds.includes(user.id);
  });

  return (
    <>
      {usersToSuggest.map((user: User) => (
        <Button
          variant="outline"
          type="button"
          className="border-dashed"
          key={user.id}
          size="sm"
          onClick={() => {
            setAssigneeValue(user.id);
          }}
        >
          {user.username}
        </Button>
      ))}
    </>
  );
}
