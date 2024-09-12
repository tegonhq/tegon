import {
  createIssue,
  getTeamById,
  IntegrationAccount,
  JsonObject,
  logger,
} from '@tegonhq/sdk';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { createLinkIssueComment } from 'utils';

export const discordIssueCreate = async (
  integrationAccount: IntegrationAccount,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issueData: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionData: Record<string, any>,
) => {
  // Extract issueInput, sourceMetadata, and userId from issueData
  const { issueInput, sourceMetadata } = issueData;

  const integrationDefinitionConfig = integrationAccount.integrationDefinition
    .config as JsonObject;

  logger.info('Creating issue with issueInput', { issueData });

  const createdIssue = await createIssue(issueInput);

  const team = await getTeamById({ teamId: createdIssue.teamId });

  logger.info('Issue created successfully', { id: createdIssue.id });

  const client = new Client({ intents: [] }); // Create a new client instance
  await client.login(integrationDefinitionConfig.botToken as string); // Login with the bot token

  const channel = (await client.channels.fetch(
    sessionData.channelId,
  )) as TextChannel;
  if (!channel) {
    logger.error(`Channel with ID ${sessionData.channelId} not found.`);
    return null;
  }
  const message = await channel.messages.fetch(sessionData.messageId);

  const issueIdentifier = `${team.identifier}-${createdIssue.number}`;
  const thread = await message.startThread({
    name: `Tegon issue #${issueIdentifier}: ${createdIssue.title}`,
  });

  logger.info(`Thread created successfully ${thread.id}`);

  const issueUrl = `https://app.tegon.ai/${team.workspace.slug}/issue/${issueIdentifier}`;

  const issueTitle = `${issueIdentifier} ${createdIssue.title}`;

  const messageEmbed = new EmbedBuilder()
    .setTitle(`${issueTitle}`)
    .setURL(issueUrl)
    .setFooter({ text: 'This thread is in sync with Tegon' });

  const threadResponse = await thread.send({
    content: `<@${sessionData.discordUserId}> created a Issue`,
    embeds: [messageEmbed],
  });

  logger.info('Discord message sent successfully');

  // Create a comment thread for this Slack thread and Update link issue with synced comment
  await createLinkIssueComment(
    issueInput.linkIssueData,
    thread.id,
    threadResponse,
    channel.name,
    createdIssue.id,
    sourceMetadata,
  );

  return createdIssue;
};
