/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { IssueStatusDropdownContent } from 'modules/issues/components';

import { useCurrentTeam } from 'hooks/teams';
import { useApplicationStore } from 'hooks/use-application-store';
import { useTeamWorkflows } from 'hooks/workflows';

interface IssueStatusFilterProps {
  value?: string;
  onChange?: (newStatus: string) => void;
  onClose: () => void;
}

export const IssueStatusFilter = observer(
  ({ onChange, onClose }: IssueStatusFilterProps) => {
    const currentTeam = useCurrentTeam();
    const workflows = useTeamWorkflows(currentTeam.identifier);
    const applicationStore = useApplicationStore();

    const statusFilters = JSON.parse(applicationStore.filters).status ?? [];

    return (
      <IssueStatusDropdownContent
        onChange={onChange}
        onClose={onClose}
        workflows={workflows}
        multiple
        value={statusFilters}
      />
    );
  },
);
