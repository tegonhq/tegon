import {
  AttachmentResponse,
  createIssue,
  EventBody,
  getLinkedIssueBySource,
  getWorkflowsByTeam,
  IntegrationAccount,
  logger,
  updateIssue,
  uploadAttachment,
} from '@tegonhq/sdk';
import axios from 'axios';
import { GmailAttachment, Part, PartHeader } from 'types';
import {
  convertHtmlToTiptapJson,
  extractForwardHtml,
  getFilesFormdata,
  getHeaders,
  getStateId,
  getUniqueId,
} from 'utils';

export const emailTriage = async (
  eventBody: EventBody,
  integrationAccount: IntegrationAccount,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  const { messageId } = eventBody;
  logger.log(`Processing message with ID: ${messageId}`);

  const headers = await getHeaders(integrationAccount);

  // Fetch the message data from the Gmail API
  const messageData = (
    await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers,
    )
  ).data;

  const { payload, threadId } = messageData;
  const {
    data: { inputs: actionInputs },
  } = action;

  if (!payload) {
    return undefined;
  }
  const subject = payload.headers.find(
    (header: PartHeader) => header.name === 'Subject',
  ).value;

  const deliveredTo = payload.headers.find(
    (header: PartHeader) => header.name === 'Delivered-To',
  ).value;

  // Get the teamId based on the delivered-to email address
  const mappingKey = await getUniqueId(deliveredTo);

  // Find the channel mapping for the given channel ID
  const { teamId } =
    actionInputs.teamMappings.find(
      ({ id }: { id: string }) => id === mappingKey,
    ) || {};

  if (!teamId) {
    logger.log(`No team Id found for email address: ${deliveredTo}`);
    return undefined;
  }
  //   const team = await getTeamById({teamId})
  const team = (await axios.get(`/api/v1/teams/${teamId}`)).data;
  if (!team) {
    logger.log(`No team found for teamId: ${teamId}`);
    return undefined;
  }
  // Get the state ID for the 'opened' state of the team
  const workflows = await getWorkflowsByTeam({ teamId });
  const stateId = await getStateId('opened', workflows);

  let htmlBody = '';
  const attachments: GmailAttachment[] = [];

  // Helper function to recursively extract HTML body and attachments from payload parts
  const extractHtmlAndAttachments = (parts: Part[]) => {
    for (const part of parts) {
      if (part.mimeType === 'text/html') {
        htmlBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
      } else if (part.mimeType.startsWith('multipart/')) {
        extractHtmlAndAttachments(part.parts);
      } else if (part.filename && part.body.attachmentId) {
        attachments.push({
          filename: part.filename,
          mimetype: part.mimeType,
          attachmentId: part.body.attachmentId,
        });
      }
    }
  };

  // Extract HTML body and attachments from payload parts
  extractHtmlAndAttachments(payload.parts || [payload]);

  // Extract forward details from the HTML body
  const forwardDetails = await extractForwardHtml(htmlBody);
  let forwardedFrom = forwardDetails.forwardedFrom;
  if (!forwardedFrom) {
    const fromValue = payload.headers.find(
      (header: PartHeader) => header.name === 'From',
    ).value;
    const nameMatch = fromValue.match(/^([^<]+)/);
    forwardedFrom = nameMatch ? nameMatch[1].trim() : null;
  }

  logger.log(`Forwarded From: ${forwardedFrom}`);

  // Convert the HTML body to Tiptap JSON format
  const tiptapJson = convertHtmlToTiptapJson(htmlBody);

  const sourceMetadata = {
    type: integrationAccount.integrationDefinition.slug,
    messageId,
    threadId,
    userDisplayName: forwardedFrom,
  };

  let attachmentUrls: AttachmentResponse[] = [];
  if (attachments.length > 0) {
    // Get the files buffer from Gmail using the integration account and message attachments
    const formData = await getFilesFormdata(attachments, headers, messageId);

    // Upload the files to GCP and get the attachment URLs
    attachmentUrls = await uploadAttachment(team.workspaceId, formData);
  }

  // Check if the issue is already linked to a thread
  const linkedIssue = await getLinkedIssueBySource({ sourceId: threadId });

  if (linkedIssue) {
    // If the issue is linked, parse the existing issue description and add attachments
    const issueTiptapJson = JSON.parse(linkedIssue.issue.description);
    tiptapJson.content.push(
      ...issueTiptapJson.content.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node: any) => node.type === 'image' || node.type === 'fileExtension',
      ),
    );
  }

  // Add attachment URLs to the Tiptap JSON content
  tiptapJson.content.push(
    ...attachmentUrls.map((attachment) => ({
      type: attachment.fileType.startsWith('image/')
        ? 'image'
        : 'fileExtension',
      attrs: {
        src: attachment.publicURL,
        alt: attachment.originalName,
        size: attachment.size,
      },
    })),
  );

  let issue;
  if (linkedIssue) {
    // If the issue is linked, update the existing issue
    issue = await updateIssue({
      issueId: linkedIssue.issueId,
      teamId,
      description: JSON.stringify(tiptapJson),
      subscriberIds: linkedIssue.issue.subscriberIds,
    });
  } else {
    // If the issue is not linked, create a new issue
    const linkIssueData = {
      url: `https://mail.google.com/mail/u/0/#inbox/${threadId}`,
      sourceId: threadId,
      sourceData: sourceMetadata,
    };

    issue = await createIssue({
      teamId,
      title: subject,
      description: JSON.stringify(tiptapJson),
      stateId,
      linkIssueData,
      sourceMetadata,
    });
  }
  logger.log(`Issue Id of the Gmail message: ${issue.id}`);

  return issue;
};
