import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export const useProjects = () => {
  const { projectsStore } = useContextStore();
  const team = useCurrentTeam();

  const projects = team
    ? projectsStore.getProjectWithTeamId(team.id)
    : projectsStore.getProjects;

  return projects;
};
