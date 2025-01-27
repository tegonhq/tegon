import { getTeams } from '@tegonhq/sdk';
import { ActionEventPayload } from '@tegonhq/sdk';

export const getInputs = async (payload: ActionEventPayload) => {
  const { workspaceId } = payload;

  const teams = await getTeams({ workspaceId });

  const teamOptions = teams.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  return {
    type: 'object',
    properties: {
      teamId: {
        type: 'select',
        title: 'Team',
        description: 'Select a support team',
        validation: {
          required: true,
        },
        options: teamOptions,
      },
    },
  };
};
