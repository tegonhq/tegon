import {
  ActionEventPayload,
  logger,
  getWorkflowsByTeam,
  createIssue,
} from '@tegonhq/sdk';

export const webhookHandler = async (payload: ActionEventPayload) => {
  // const { eventBody, integrationAccounts, userId, action } = payload;
  logger.log('Processing Sentry event:', payload);

  // if(eventBody)
};

// async function createTegonIssue(eventBody: any): Promise<any> {
//   const [{ type, value }] = eventBody.data.event.exception.values;
//   const { project } = eventBody.data.event;
//   // Find the channel mapping for the given channel ID
//   const projectMapping =
//     eventBody.data.action.data.inputs.projectTeamMappings.find(
//       ({ projectId: mappedProjectId }: { projectId: string }) =>
//         mappedProjectId === project,
//     );

//   if (!projectMapping) {
//     logger.debug(`The projectMapping is not connected`);
//     return undefined;
//   }

//   const teamId = projectMapping.teamId;

//   const workflows = await getWorkflowsByTeam({
//     teamId,
//   });

//   const todoWorkflow = workflows.find(
//     (workflow) => workflow.category === 'BACKLOG',
//   );

//   // await createIssue({
//   //   teamId,
//   //   title,
//   //   description,
//   //   stateId: todoWorkflow.id,
//   //   linkIssueData: {
//   //     url: webUrl,
//   //     sourceId: integrationAccount.integrationDefinitionId,
//   //     sourceData: {
//   //       title,
//   //       issueId,
//   //       project,
//   //       actor,
//   //     },
//   //   },
//   // });

//   return;
// }
