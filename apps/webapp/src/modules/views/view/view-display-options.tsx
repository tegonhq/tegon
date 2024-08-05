import type { ViewType } from 'common/types';

import { observer } from 'mobx-react-lite';

import {
  GroupingOrderingOptions,
  LayoutSwitch,
  ViewOptions,
} from 'modules/issues/components';

import { SaveViewAction } from './save-view-action';

interface ViewDisplayOptionsProps {
  view: ViewType;
}

export const ViewDisplayOptions = observer(
  ({ view }: ViewDisplayOptionsProps) => {
    return (
      <div className="flex gap-2 h-full">
        <GroupingOrderingOptions />
        <LayoutSwitch />
        <ViewOptions />

        <SaveViewAction view={view} />
      </div>
    );
  },
);
