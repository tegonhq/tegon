import type { IssueType } from 'common/types';

import { useUpdateIssueMutation } from 'services/issues';
import { DropdownMenuItem } from '@tegonhq/ui/components/dropdown-menu';
import { ParentIssueLine } from '@tegonhq/ui/icons';

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
