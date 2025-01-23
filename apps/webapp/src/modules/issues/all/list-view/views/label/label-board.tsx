import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { LabelType } from 'common/types';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { LabelBoardList, NoLabelBoardList } from './label-board-list';
import { useComputedWorkflows } from 'hooks/workflows';
import { useComputedLabels } from 'hooks/labels';

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

const getLabelId = (
  labelName: string,
  labelMap: any,
  labels: LabelType[],
  teamId: string,
) => {
  const labelIds = labels.find((label) => label.name === labelName).ids;

  const labelId = labelIds.find(
    (labelId) =>
      labelMap[labelId].teamId === null || labelMap[labelId].teamId === teamId,
  );

  return labelId;
};

export const LabelBoard = observer(({ labels }: LabelBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();
  const { labelMap } = useComputedLabels();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId.includes('__')
      ? result.draggableId.split('__')[1]
      : result.draggableId;

    if (!result.destination) {
      return;
    }

    const issue = issuesStore.getIssueById(issueId);
    const sourceLabelId =
      result.source.droppableId !== 'no-label'
        ? getLabelId(result.source.droppableId, labelMap, labels, issue.teamId)
        : undefined;

    const destinationId =
      result.destination.droppableId !== 'no-label'
        ? getLabelId(
            result.destination.droppableId,
            labelMap,
            labels,
            issue.teamId,
          )
        : 'no-label';

    const newLabelIds = updateOrAddID(
      [...issue.labelIds],
      sourceLabelId,
      destinationId === 'no-label' ? undefined : destinationId,
    );

    updateIssue({ id: issue.id, teamId: issue.teamId, labelIds: newLabelIds });
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-4">
      <>
        {labels.map((label: LabelType) => {
          return <LabelBoardList key={label.id} label={label} />;
        })}
        <NoLabelBoardList />
      </>
    </Board>
  );
});
