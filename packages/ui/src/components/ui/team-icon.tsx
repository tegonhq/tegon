import { TeamLine } from '../../icons';
import { getTeamColor } from '../../lib/color-utils';

export interface TeamIconProps {
  name: string;
}

export function TeamIcon({ name }: TeamIconProps) {
  return (
    <div
      className={`w-5 h-5 rounded-sm flex items-center justify-center text-black`}
      style={{ background: getTeamColor(name) }}
    >
      <TeamLine className="shrink-0 !h-4 !w-4" />
    </div>
  );
}
