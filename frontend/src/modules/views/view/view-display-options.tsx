/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import {
  GroupingOrderingOptions,
  LayoutSwitch,
  ViewOptions,
} from 'modules/issues/components';

import type { ViewType } from 'common/types/view';

import { Separator } from 'components/ui/separator';

import { SaveViewAction } from './save-view-action';

interface ViewDisplayOptionsProps {
  view: ViewType;
}

export const ViewDisplayOptions = observer(
  ({ view }: ViewDisplayOptionsProps) => {
    return (
      <div className="flex gap-2">
        <GroupingOrderingOptions />
        <LayoutSwitch />
        <ViewOptions />

        <Separator orientation="vertical" />
        <SaveViewAction view={view} />
      </div>
    );
  },
);
