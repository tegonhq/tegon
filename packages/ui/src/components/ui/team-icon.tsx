import { HelpCentre, Code } from '../../icons';
import { getTeamColor } from '../../lib/color-utils';
import { cn } from '../../lib/utils';

export interface TeamIconProps {
  name: string;
  className?: string;
  icon?: string;
  preferences?: {
    teamType?: string;
  };
}

export function TeamIcon({ name, className, preferences }: TeamIconProps) {
  const Icon = preferences?.teamType === 'support' ? HelpCentre : Code;

  return (
    <div
      className={cn(
        `w-5 h-5 rounded-sm flex items-center justify-center text-black`,
        className,
      )}
      style={{ background: name && getTeamColor(name) }}
    >
      <Icon className="shrink-0 !h-4 !w-4" />
    </div>
  );
}
