/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { useTeamLabels } from 'hooks/labels';
import { useCurrentTeam } from 'hooks/teams';

import { FilterType } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueLabelFilterProps {
  value?: string[];
  onChange?: (value: string[], filterType: FilterType) => void;
  onClose: () => void;
}

export const IssueLabelFilter = observer(
  ({ onChange }: IssueLabelFilterProps) => {
    const currentTeam = useCurrentTeam();
    const labels = useTeamLabels(currentTeam.identifier);
    const { applicationStore } = useContextStore();

    const labelFilters = applicationStore.filters.label
      ? applicationStore.filters.label.value
      : [];

    const change = (value: string[]) => {
      onChange(value, FilterType.IS);
    };

    return (
      <IssueLabelDropdownContent
        value={labelFilters}
        onChange={change}
        labels={labels}
      />
    );
  },
);
