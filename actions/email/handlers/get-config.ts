import { ActionEventPayload, getTeams, Team } from '@tegonhq/sdk';

export const getConfig = async (payload: ActionEventPayload) => {
  const { workspaceId } = payload;

  // Fetch teams from the API
  const teams = await getTeams({ workspaceId });

  // Create a map of teams with label and value properties
  const teamOptions = teams.map((team: Team) => ({
    label: team.name,
    value: team.id,
  }));

  return {
    type: 'object',
    properties: {
      teamMappings: {
        type: 'array',
        title: 'Id to Team Mappings',
        description: 'Map a unique Id to a team',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'text',
              title: 'Unique Id',
              validation: {
                required: true,
              },
            },
            teamId: {
              type: 'select',
              title: 'Team ID',
              validation: {
                required: true,
              },
              options: teamOptions,
            },
          },
        },
      },
    },
  };
};
