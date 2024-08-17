import { Button } from '@tegonhq/ui/components/button';

import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

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
