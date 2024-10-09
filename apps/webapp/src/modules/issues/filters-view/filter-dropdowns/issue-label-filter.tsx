import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { useTeamLabels } from 'hooks/labels';
import { useCurrentTeam } from 'hooks/teams';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueLabelFilterProps {
  value?: string[];
  onChange?: (value: string[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssueLabelFilter = observer(
  ({ onChange }: IssueLabelFilterProps) => {
    const [labelSearch, setLabelSearch] = React.useState('');

    const currentTeam = useCurrentTeam();
    const labels = useTeamLabels(currentTeam?.identifier);

    const { applicationStore } = useContextStore();

    const labelFilters = applicationStore.filters.label
      ? applicationStore.filters.label.value
      : [];

    const change = (value: string[]) => {
      onChange(value, FilterTypeEnum.INCLUDES);
    };

    return (
      <IssueLabelDropdownContent
        value={labelFilters}
        onChange={change}
        labels={labels}
        labelSearch={labelSearch}
        setLabelSearch={setLabelSearch}
      />
    );
  },
);
