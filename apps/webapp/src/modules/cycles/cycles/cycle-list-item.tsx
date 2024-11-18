import type { CycleType } from 'common/types';

interface CycleListItemProps {
  cycle: CycleType;
}

export function CycleListItem({ cycle }: CycleListItemProps) {
  return (
    <div className="bg-background-2 p-4 rounded-md">
      <h2 className="text-md">{cycle.name}</h2>
    </div>
  );
}
