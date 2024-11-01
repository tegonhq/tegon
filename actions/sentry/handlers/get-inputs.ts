import {
  ActionEventPayload,
  getTeams,
  IntegrationAccount,
  Team,
} from '@tegonhq/sdk';
import axios from 'axios';
import { getSentryHeaders } from 'utils';
import * as console from 'node:console';

export const getInputs = async (payload: ActionEventPayload) => {
  const { workspaceId, integrationAccounts } = payload;

  const integrationAccount = integrationAccounts.sentry;
  // Fetch teams from the API

  const teams = await getTeams({ workspaceId });

  // Create a map of teams with label and value properties
  const teamOptions = teams.map((team: Team) => ({
    label: team.name,
    value: team.id,
  }));

  const sentryProjects = await getAllSentryProjects(integrationAccount);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projectId: any = {
    type: 'text',
    title: 'Channels',
    validation: {
      required: true,
    },
  };

  if (sentryProjects.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectOptions = sentryProjects.map((project: any) => ({
      label: project.name,
      value: project.id,
    }));
    projectId = {
      type: 'select',
      title: 'Channels',
      validation: {
        required: true,
      },
      options: projectOptions,
    };
  }

  return {
    type: 'object',
    properties: {
      projectTeamMappings: {
        type: 'array',
        title: 'Project to Team Mappings',
        description: 'Map each project to a team',
        items: {
          type: 'object',
          properties: {
            projectId,
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
    },
  };
};

async function getAllSentryProjects(integrationAccount: IntegrationAccount) {
  try {
    const { orgSlug } = integrationAccount.integrationConfiguration as any;

    const url = `https://sentry.io/api/0/organizations/${orgSlug}/projects/`;
    const response = await axios.get(
      url,
      getSentryHeaders(integrationAccount), // Assume getSentryHeaders sets the authorization headers
    );

    const sentryProjects = response.data;

    if (response.status !== 200) {
      throw new Error(`Error fetching Sentry projects: ${response.statusText}`);
    }

    return sentryProjects;
  } catch (error) {
    return [];
  }
}
