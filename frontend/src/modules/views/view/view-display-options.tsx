/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { SaveViewActions } from 'modules/issues/all/save-view-actions';
import {
  GroupingOrderingOptions,
  LayoutSwitch,
  ViewOptions,
} from 'modules/issues/components';

export const ViewDisplayOptions = observer(() => {
  return (
    <div className="flex gap-2">
      <GroupingOrderingOptions />
      <LayoutSwitch />
      <ViewOptions />

      <SaveViewActions />
    </div>
  );
});
