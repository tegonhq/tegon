import { ActionEventPayload, Team } from '@tegonhq/sdk';
import axios from 'axios';
import config from 'config.json';
export const getConfig = async (payload: ActionEventPayload) => {
  const { workspaceId } = payload;

  // Fetch teams from the API
  //   const teams = await getTeams({ workspaceId });
  const teams = (await axios.get(`/api/v1/teams?workspaceId=${workspaceId}`))
    .data;

  // Create a map of teams with label and value properties
  const teamOptions = teams.map((team: Team) => ({
    label: team.name,
    value: team.id,
  }));

  // Update the config with the team options
  config.inputs.properties.teamMappings.items.properties.teamId.options =
    teamOptions;

  return config;
};
