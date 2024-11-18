import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { TeamType } from 'common/types';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { TeamBoardList } from './team-board-list';

interface TeamBoardProps {
  teams: TeamType[];
}

export const TeamBoard = observer(({ teams }: TeamBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId;

    const teamId = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);

    if (teamId !== issue.teamId) {
      updateIssue({ id: issueId, teamId });
    }
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-4">
      <>
        {teams.map((team: TeamType) => {
          return <TeamBoardList key={team.id} team={team} />;
        })}
      </>
    </Board>
  );
});
