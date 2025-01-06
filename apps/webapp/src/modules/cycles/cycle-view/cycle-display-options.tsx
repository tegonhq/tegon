import { observer } from 'mobx-react-lite';

import {
  GroupingOrderingOptions,
  LayoutSwitch,
  ViewOptions,
} from 'modules/issues/components';

export const CycleDisplayOptions = observer(() => {
  return (
    <div className="flex gap-2 h-full">
      <GroupingOrderingOptions />
      <LayoutSwitch />
      <ViewOptions />
    </div>
  );
});
