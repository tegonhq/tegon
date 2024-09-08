import {
  ActionEventPayload,
  getLabels,
  getTeams,
  Label,
  Team,
} from '@tegonhq/sdk';
import axios from 'axios';
import { getGithubHeaders } from 'utils';

export const getInputs = async (payload: ActionEventPayload) => {
  const { workspaceId, integrationAccounts } = payload;

  const integrationAccount = integrationAccounts.github;
  const integrationConfig =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    integrationAccount.integrationConfiguration as Record<string, any>;
  // Fetch teams from the API
  const teams = await getTeams({ workspaceId });

  // Create a map of teams with label and value properties
  const teamOptions = teams.map((team: Team) => ({
    label: team.name,
    value: team.id,
  }));

  const labels = await getLabels({ workspaceId, teamId: null });
  // Create a map of label with label and value properties
  const labelOptions = labels.map((label: Label) => ({
    label: label.name,
    value: label.id,
  }));

  const response = (
    await axios.get(
      `https://api.github.com/user/installations/${integrationAccount.accountId}/repositories`,
      getGithubHeaders(integrationConfig.token),
    )
  ).data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let repo: any = {
    type: 'text',
    title: 'Repository Id',
    validation: {
      required: true,
    },
  };
  if (response) {
    const repositoryOptions = response.repositories.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (repo: any) => ({
        label: repo.full_name,
        value: repo.id,
      }),
    );
    repo = {
      type: 'select',
      title: 'Repositories',
      validation: {
        required: true,
      },
      options: repositoryOptions,
    };
  }

  return {
    type: 'object',
    properties: {
      repoTeamMappings: {
        type: 'array',
        title: 'Repo to Team Mappings',
        description: 'Map each repo to a team',
        items: {
          type: 'object',
          properties: {
            repo,
            teamId: {
              type: 'select',
              title: 'Teams',
              validation: {
                required: true,
              },
              options: teamOptions,
            },
          },
        },
      },
      githubLabel: {
        type: 'select',
        title: 'Select a label to sync with Github',
        validate: { required: true },
        options: labelOptions,
      },
    },
  };
};
