import { observer } from 'mobx-react-lite';

import { IssueStatusDropdownContent } from 'modules/issues/components';

import { useComputedWorkflows } from 'hooks/workflows';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueStatusFilterProps {
  value?: string;
  onChange?: (status: string[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssueStatusFilter = observer(
  ({ onChange, onClose }: IssueStatusFilterProps) => {
    const { workflows } = useComputedWorkflows();

    const { applicationStore } = useContextStore();

    const statusFilters = applicationStore.filters.status
      ? applicationStore.filters.status.value
      : [];

    const computedValues = statusFilters.map((value: string) => {
      const workfow = workflows.find((workflow) => workflow.name === value);

      return workfow.id;
    });

    const change = (value: string[]) => {
      const names = value.map((val: string) => {
        const workflow = workflows.find((workflow) => workflow.id === val);

        return workflow.name;
      });
      onChange(names, FilterTypeEnum.IS);
    };

    return (
      <IssueStatusDropdownContent
        onChange={change}
        onClose={onClose}
        workflows={workflows}
        multiple
        value={computedValues}
      />
    );
  },
);
