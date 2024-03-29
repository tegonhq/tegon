/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { useTeamLabels } from 'hooks/labels';

import { useContextStore } from 'store/global-context-provider';

interface IssueLabelFilterProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  onClose: () => void;
}

export const IssueLabelFilter = observer(
  ({ onChange }: IssueLabelFilterProps) => {
    const labels = useTeamLabels();
    const { applicationStore } = useContextStore();

    const labelFilters = JSON.parse(applicationStore.filters).label ?? [];

    return (
      <IssueLabelDropdownContent
        value={labelFilters}
        onChange={onChange}
        labels={labels}
      />
    );
  },
);
