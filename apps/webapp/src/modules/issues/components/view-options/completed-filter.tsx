import { CheckLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { TimeBasedFilterEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface ItemProps {
  text: string;
  selected?: boolean;
  onChange: (value: string) => void;
}

function Item({ text, selected = false, onChange }: ItemProps) {
  return (
    <div
      onClick={() => onChange(text)}
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1 pl-2 pr-8 gap-1 outline-none focus:bg-accent focus:text-accent-foreground"
    >
      <span className="flex h-3.5 w-3.5 items-center justify-center">
        {selected && (
          <div>
            <CheckLine className="h-4 w-4" />
          </div>
        )}
      </span>
      <div>{text}</div>
    </div>
  );
}

export const CompletedFilter = observer(() => {
  const { applicationStore } = useContextStore();

  const onFilterChange = (value: string) => {
    applicationStore.updateDisplaySettings({
      completedFilter: value,
    });
  };

  return (
    <div className="flex flex-col">
      {Object.values(TimeBasedFilterEnum).map((filter) => (
        <Item
          key={filter}
          text={filter}
          onChange={onFilterChange}
          selected={filter === applicationStore.displaySettings.completedFilter}
        />
      ))}
    </div>
  );
});
