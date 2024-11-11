import { observer } from 'mobx-react-lite';

import { ProjectDropdownContent } from 'modules/issues/components/issue-metadata/project';

import { useProjects } from 'hooks/projects';

import { FilterTypeEnum } from 'store/application';
import { useContextStore } from 'store/global-context-provider';

interface IssueProjectFilterProps {
  onChange?: (projectId: string[], filterType: FilterTypeEnum) => void;
  onClose: () => void;
}

export const IssueProjectFilter = observer(
  ({ onChange, onClose }: IssueProjectFilterProps) => {
    const { applicationStore } = useContextStore();
    const projects = useProjects();

    const projectFilters = applicationStore.filters.project
      ? applicationStore.filters.project.value
      : [];

    const change = (value: string[]) => {
      onChange(value, FilterTypeEnum.IS);
    };

    return (
      <ProjectDropdownContent
        onChange={change}
        onClose={onClose}
        projects={projects}
        value={projectFilters}
        multiple
      />
    );
  },
);
