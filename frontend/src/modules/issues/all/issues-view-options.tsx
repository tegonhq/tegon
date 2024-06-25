/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from 'components/ui/separator';

import { SaveViewActions } from './save-view-actions';
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
      <Separator orientation="vertical" />
      <SaveViewActions />
    </div>
  );
}
