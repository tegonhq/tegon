import { ScrollArea } from '@tegonhq/ui/components/scroll-area';

import type { ProjectType } from 'common/types';

import { ProjectViewList, NoProjectView } from './project-view-list';

interface ProjectListProps {
  projects: ProjectType[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ScrollArea className="h-full w-full" id="assignee-list">
      <div className="flex flex-col gap-4 h-full pb-[100px]">
        {projects.map((project: ProjectType) => (
          <ProjectViewList key={project.id} project={project} />
        ))}
        <NoProjectView />
      </div>
    </ScrollArea>
  );
}
