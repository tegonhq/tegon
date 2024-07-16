import type { IssueType } from 'common/types/issue';

import { DropdownMenuItem } from 'components/ui/dropdown-menu';
import { ParentIssueLine } from 'icons';

import { useUpdateIssueMutation } from 'services/issues';

import { DropdownItem } from './dropdown-item';

interface RemoveParentIssueProps {
  issue: IssueType;
}

export function RemoveParentIssue({ issue }: RemoveParentIssueProps) {
  const { mutate: updateIssue } = useUpdateIssueMutation({});

  return (
    <DropdownMenuItem
      onClick={() => {
        updateIssue({ id: issue.id, parentId: null, teamId: issue.teamId });
      }}
    >
      <DropdownItem Icon={ParentIssueLine} title="Remove parent issue" />
    </DropdownMenuItem>
  );
}
