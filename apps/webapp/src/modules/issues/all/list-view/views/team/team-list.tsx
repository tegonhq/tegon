import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import type { TeamType } from 'common/types';

import { TeamViewList } from './team-view-list';

interface TeamListProps {
  teams: TeamType[];
}

export function TeamList({ teams }: TeamListProps) {
  return (
    <ScrollArea className="h-full w-full" id="assignee-list">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {teams.map((team: TeamType) => (
          <TeamViewList key={team.id} team={team} />
        ))}
      </div>
    </ScrollArea>
  );
}
