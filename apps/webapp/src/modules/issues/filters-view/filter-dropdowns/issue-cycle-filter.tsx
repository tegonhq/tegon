import { observer } from 'mobx-react-lite';

import { CycleDropdownContent } from 'modules/issues/components';

import { useCycles } from 'hooks/cycles';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueCycleFilterProps {
  onChange?: (cycle: string[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssueCycleFilter = observer(
  ({ onChange, onClose }: IssueCycleFilterProps) => {
    const { applicationStore } = useContextStore();
    const { cycles } = useCycles();

    const cyclesFilters = applicationStore.filters.cycle
      ? applicationStore.filters.cycle.value
      : [];

    const change = (value: string[]) => {
      onChange(value, FilterTypeEnum.IS);
    };

    return (
      <CycleDropdownContent
        onChange={change}
        onClose={onClose}
        value={cyclesFilters}
        multiple
        cycles={cycles}
      />
    );
  },
);
