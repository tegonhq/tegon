import { updateTeam, type UpdateTeamDtoWithTeamId } from '@tegonhq/services';
import { useMutation } from 'react-query';

import type { TeamType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (team: TeamType) => void;
  onError?: (error: string) => void;
}

export function useUpdateTeamMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const { teamsStore } = useContextStore();
  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  const update = async ({
    teamId,
    ...otherParams
  }: UpdateTeamDtoWithTeamId) => {
    const team = teamsStore.getTeamWithId(teamId);

    try {
      teamsStore.update({ ...otherParams, preferences: {} }, team.id);
      return updateTeam({ ...otherParams, teamId });
    } catch (e) {
      teamsStore.update(team, team.id);
      return undefined;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (team: TeamType) => {
    onSuccess && onSuccess(team);
  };

  return useMutation(update, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
