/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { getTeamColor } from 'common/color-utils';

import { TeamLine } from 'icons';

export interface TeamIconProps {
  name: string;
}

export function TeamIcon({ name }: TeamIconProps) {
  return (
    <div className={`p-[2px] w-5 h-5 ${getTeamColor(name, true)} rounded-sm`}>
      <TeamLine
        size={14}
        className={`shrink-0 h-4 w-4 ${getTeamColor(name)}`}
      />
    </div>
  );
}
