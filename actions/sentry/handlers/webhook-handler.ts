import {
  ActionEventPayload,
  logger,
  getWorkflowsByTeam,
  createIssue,
} from '@tegonhq/sdk';

export const webhookHandler = async (payload: ActionEventPayload) => {
  const { eventBody } = payload;

  if (eventBody.action === 'triggered') {
    return createTegonIssue(payload);
  }
};

async function createTegonIssue(payload: ActionEventPayload): Promise<any> {
  const { eventBody, integrationAccounts, action } = payload;

  const { project, issue_url, title, exception, web_url, user } = eventBody.data
    .event as any;

  // Find the channel mapping for the given channel ID
  const projectMapping = action.data.inputs.projectTeamMappings.find(
    ({ projectId: mappedProjectId }: { projectId: string }) =>
      mappedProjectId.toString() === project.toString(),
  );

  if (!projectMapping) {
    logger.debug(`The projectMapping is not connected`);
    return undefined;
  }

  const teamId = projectMapping.teamId;

  const workflows = (await getWorkflowsByTeam({
    teamId,
  })) as any[];

  const todoWorkflow = workflows.find(
    (workflow) => workflow.category === 'BACKLOG',
  );

  await createIssue({
    teamId,
    title,
    description: JSON.stringify(exception),
    stateId: todoWorkflow.id,
    linkIssueData: {
      url: issue_url,
      sourceId: integrationAccounts.sentry.integrationDefinitionId,
      sourceData: {
        title,
        issueId: web_url,
        project,
        actor: user,
      },
    },
  });

  return;
}
