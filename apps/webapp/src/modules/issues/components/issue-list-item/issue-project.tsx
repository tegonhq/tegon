import { Badge } from '@tegonhq/ui/components/badge';
import { LabelLine, Project } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import { useContextStore } from 'store/global-context-provider';

interface IssueProjectProps {
  projectId: string;
  projectMilestoneId: string;
}

export const IssueProject = observer(
  ({ projectId, projectMilestoneId }: IssueProjectProps) => {
    const { projectMilestonesStore, projectsStore } = useContextStore();

    if (!projectId) {
      return null;
    }

    function getMilestone() {
      if (projectMilestoneId) {
        const milestone =
          projectMilestonesStore.getMilestoneWithId(projectMilestoneId);

        if (!milestone) {
          return null;
        }

        return (
          <div className="inline-flex items-center gap-1 border-l border-border pl-1 min-w-[0px]">
            <LabelLine size={14} />
            <div className="truncate"> {milestone.name}</div>
          </div>
        );
      }

      return null;
    }

    const project = projectsStore.getProjectWithId(projectId);

    if (!project) {
      return null;
    }

    return (
      <div className="inline-flex items-center gap-1 flex-wrap">
        <Badge
          variant="secondary"
          key={project.name}
          className="flex items-center gap-1 shrink min-w-[0px]"
        >
          <Project size={14} className="shrink-0" />
          <div className="truncate"> {project.name}</div>
          {getMilestone()}
        </Badge>
      </div>
    );
  },
);
