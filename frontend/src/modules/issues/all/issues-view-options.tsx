/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { SaveViewActions } from './save-view-actions';
import {
  GroupingOrderingOptions,
  LayoutSwitch,
  ViewOptions,
} from '../components';

export function IssuesViewOptions() {
  return (
    <div className="flex gap-2 h-full">
      <GroupingOrderingOptions />
      <LayoutSwitch />
      <ViewOptions />
      <SaveViewActions />
    </div>
  );
}
