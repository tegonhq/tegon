import { getPriorities } from 'common/priority';

import { useCurrentWorkspace } from 'hooks/workspace';

export const usePriorities = () => {
  const workspace = useCurrentWorkspace();
  const Priorities = getPriorities(workspace.preferences?.priorityType);

  return Priorities;
};
