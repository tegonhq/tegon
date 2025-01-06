import { TeamLine } from '../../icons';
import { getTeamColor } from '../../lib/color-utils';
import { cn } from '../../lib/utils';

export interface TeamIconProps {
  name: string;
  className?: string;
}

export function TeamIcon({ name, className }: TeamIconProps) {
  return (
    <div
      className={cn(
        `w-5 h-5 rounded-sm flex items-center justify-center text-black`,
        className,
      )}
      style={{ background: name && getTeamColor(name) }}
    >
      <TeamLine className="shrink-0 !h-4 !w-4" />
    </div>
  );
}
