import { observer } from 'mobx-react-lite';

import { IssuePriorityDropdownContent } from 'modules/issues/components';

import { usePriorities } from 'hooks/priorities';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssuePriorityFilterProps {
  onChange?: (priority: number[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssuePriorityFilter = observer(
  ({ onChange, onClose }: IssuePriorityFilterProps) => {
    const { applicationStore } = useContextStore();
    const Priorities = usePriorities();

    const priorityFilters = applicationStore.filters.priority
      ? applicationStore.filters.priority.value
      : [];

    const change = (value: number[]) => {
      onChange(value, FilterTypeEnum.IS);
    };

    return (
      <IssuePriorityDropdownContent
        onChange={change}
        onClose={onClose}
        value={priorityFilters}
        multiple
        Priorities={Priorities}
      />
    );
  },
);
