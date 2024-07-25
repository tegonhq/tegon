import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { LabelType } from 'common/types/label';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { LabelBoardList, NoLabelBoardList } from './label-board-list';

interface LabelBoardProps {
  labels: LabelType[];
}

function updateOrAddID(idsArray: string[], idToUpdate: string, newID: string) {
  // If newID is undefined, remove the idToUpdate from the array
  if (newID === undefined) {
    const indexToRemove = idsArray.indexOf(idToUpdate);
    if (indexToRemove !== -1) {
      idsArray.splice(indexToRemove, 1);
    }
  } else {
    // Check if the idToUpdate already exists in the array
    const index = idsArray.indexOf(idToUpdate);

    // If the idToUpdate exists, update it with the newID; otherwise, add the newID to the array
    if (index !== -1) {
      idsArray[index] = newID;
    } else {
      idsArray.push(newID);
    }
  }

  return idsArray;
}

export const LabelBoard = observer(({ labels }: LabelBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId.split('__')[1];

    const labelId = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);

    const newLabelIds = updateOrAddID(
      [...issue.labelIds],
      result.source.droppableId,
      labelId === 'no-label' ? undefined : labelId,
    );

    updateIssue({ id: issue.id, teamId: issue.teamId, labelIds: newLabelIds });
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-6">
      <>
        {labels.map((label: LabelType) => {
          return <LabelBoardList key={label.id} label={label} />;
        })}
        <NoLabelBoardList />
      </>
    </Board>
  );
});
