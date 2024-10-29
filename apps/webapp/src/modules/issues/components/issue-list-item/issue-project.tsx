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

        return (
          <div className="inline-flex items-center gap-1 flex-wrap border-l border-border pl-1">
            <LabelLine size={14} />
            {milestone.name}
          </div>
        );
      }

      return null;
    }

    const project = projectsStore.getProjectWithId(projectId);

    return (
      <div className="inline-flex items-center gap-1 flex-wrap">
        <Badge
          variant="secondary"
          key={project.name}
          className="flex items-center gap-1"
        >
          <Project size={14} />
          {project.name}
          {getMilestone()}
        </Badge>
      </div>
    );
  },
);
