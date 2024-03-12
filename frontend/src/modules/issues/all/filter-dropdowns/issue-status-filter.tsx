/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IssueStatusDropdownContent } from 'modules/issues/components';

import { useTeamWorkflows } from 'hooks/workflows';

interface IssueStatusFilterProps {
  value?: string;
  onChange?: (newStatus: string) => void;
  onClose: () => void;
}

export function IssueStatusFilter({
  onChange,
  onClose,
}: IssueStatusFilterProps) {
  const workflows = useTeamWorkflows();

  return (
    <IssueStatusDropdownContent
      onChange={onChange}
      onClose={onClose}
      workflows={workflows}
    />
  );
}
