/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { IssueStatusDropdownContent } from 'modules/issues/components';

import { useCurrentTeam } from 'hooks/teams';
import { useTeamWorkflows } from 'hooks/workflows';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueStatusFilterProps {
  value?: string;
  onChange?: (status: string[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssueStatusFilter = observer(
  ({ onChange, onClose }: IssueStatusFilterProps) => {
    const currentTeam = useCurrentTeam();
    const workflows = useTeamWorkflows(currentTeam.identifier);
    const { applicationStore } = useContextStore();

    const statusFilters = applicationStore.filters.status
      ? applicationStore.filters.status.value
      : [];

    const change = (value: string[]) => {
      onChange(value, FilterTypeEnum.IS);
    };

    return (
      <IssueStatusDropdownContent
        onChange={change}
        onClose={onClose}
        workflows={workflows}
        multiple
        value={statusFilters}
      />
    );
  },
);
