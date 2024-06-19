/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  GroupingOrderingOptions,
  LayoutSwitch,
  ViewOptions,
} from '../components';

export function IssuesViewOptions() {
  return (
    <div className="flex gap-2">
      <GroupingOrderingOptions />
      <LayoutSwitch />
      <ViewOptions />
    </div>
  );
}
