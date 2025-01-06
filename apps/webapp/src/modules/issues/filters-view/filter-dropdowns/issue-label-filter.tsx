import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { useComputedLabels } from 'hooks/labels';

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
    const { labels } = useComputedLabels();

    const { applicationStore } = useContextStore();

    const labelFilters = applicationStore.filters.label
      ? applicationStore.filters.label.value
      : [];

    const change = (value: string[]) => {
      const names = value.map((val: string) => {
        const label = labels.find((labels) => labels.id === val);

        return label.name;
      });

      onChange(names, FilterTypeEnum.INCLUDES);
    };

    const computedValues = labelFilters.flatMap((val: string) => {
      const label = labels.find((label) => label.name === val);

      return label.ids;
    });

    return (
      <IssueLabelDropdownContent
        value={computedValues}
        onChange={change}
        labels={labels}
        labelSearch={labelSearch}
        setLabelSearch={setLabelSearch}
      />
    );
  },
);
