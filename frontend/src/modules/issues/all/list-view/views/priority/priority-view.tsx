/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Priorities } from 'common/types/issue';

import { PriorityViewItem } from './priority-view-item';

export function PriorityView() {
  return (
    <div>
      {Priorities.map((priority: string, index: number) => (
        <PriorityViewItem key={priority} priority={index} />
      ))}
    </div>
  );
}
