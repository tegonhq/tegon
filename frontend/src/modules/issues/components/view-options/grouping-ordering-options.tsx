import { observer } from 'mobx-react-lite';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { BulletListLine, StackLine } from 'icons';

import { useContextStore } from 'store/global-context-provider';

export const GroupingOrderingOptions = observer(() => {
  const { applicationStore } = useContextStore();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={applicationStore.displaySettings.grouping}
        onValueChange={(value: string) => {
          applicationStore.updateDisplaySettings({
            grouping: value,
          });
        }}
      >
        <SelectTrigger className="h-7 py-1 flex gap-1 items-center">
          <StackLine size={16} />
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs font-normal">Group by</SelectLabel>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="assignee">Assignee</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="label">Label</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={applicationStore.displaySettings.ordering}
        onValueChange={(value: string) => {
          applicationStore.updateDisplaySettings({
            ordering: value,
          });
        }}
      >
        <SelectTrigger className="h-7 py-1 flex gap-1 items-center">
          <BulletListLine size={16} />
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs font-normal">Order by</SelectLabel>

            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="assignee">Assignee</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="updated_at">Last updated</SelectItem>
            <SelectItem value="created_at">Last created</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});
