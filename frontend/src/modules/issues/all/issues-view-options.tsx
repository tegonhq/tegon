/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { LayoutSwitch, ViewOptions } from '../components';

export function IssuesViewOptions() {
  return (
    <div className="flex gap-2">
      <LayoutSwitch />
      <ViewOptions />
    </div>
  );
}
