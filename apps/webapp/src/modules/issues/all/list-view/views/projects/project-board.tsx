import type { DropResult } from '@hello-pangea/dnd';

import { Board } from '@tegonhq/ui/components/board';
import { observer } from 'mobx-react-lite';

import type { ProjectType } from 'common/types';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { ProjectBoardList, NoProjectView } from './project-board-list';

interface ProjectBoardProps {
  projects: ProjectType[];
}

export const ProjectBoard = observer(({ projects }: ProjectBoardProps) => {
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore } = useContextStore();

  const onDragEnd = (result: DropResult) => {
    const issueId = result.draggableId;

    const projectId = result.destination.droppableId;
    const issue = issuesStore.getIssueById(issueId);

    if (projectId !== issue.projectId) {
      updateIssue({ id: issueId, projectId, teamId: issue.teamId });
    }
  };

  return (
    <Board onDragEnd={onDragEnd} className="pl-4">
      <>
        {projects.map((project: ProjectType) => {
          return <ProjectBoardList key={project.id} project={project} />;
        })}

        <NoProjectView />
      </>
    </Board>
  );
});
