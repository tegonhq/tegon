/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IntegrationName, Issue } from '@prisma/client';
import { CronJob } from 'cron';
import { PrismaService } from 'nestjs-prisma';

import { convertHtmlToTiptapJson } from 'common/utils/tiptap.utils';

import { AttachmentResponse } from 'modules/attachments/attachments.interface';
import { AttachmentService } from 'modules/attachments/attachments.service';
import {
  CreateIssueInput,
  TeamRequestParams,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { LinkIssueData } from 'modules/linked-issue/linked-issue.interface';

import {
  GmailAttachment,
  GmailHeaders,
  Message,
  MessagesBody,
  Part,
  PartHeader,
} from './gmail.interface';
import {
  extractForwardHtml,
  getFilesBuffer,
  getHeaders,
  getState,
  getTeam,
} from './gmail.utils';
import { EventBody } from '../integrations.interface';
import { getRequest, postRequest } from '../integrations.utils';

@Injectable()
export default class GmailService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private attachmentService: AttachmentService,
    private issuesService: IssuesService,
  ) {}

  private readonly logger: Logger = new Logger('GmailService', {
    timestamp: true,
  });

  async onModuleInit() {
    await this.scheduleGmailWatch();
  }

  async handleEvents(eventBody: EventBody) {
    const messageData = eventBody.message.data;
    const decodedData = Buffer.from(messageData, 'base64').toString('utf-8');
    const { historyId } = JSON.parse(decodedData);

    this.logger.log(`History ID: ${historyId}`);

    const headers = await getHeaders();

    const messageResponse = await getRequest(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox+label:UNREAD',
      headers,
    );

    const messageResponseData = messageResponse.data as MessagesBody;
    if (messageResponseData.messages) {
      messageResponseData.messages.forEach(async (message: Message) => {
        await this.handleMessage(message.id, headers);
      });
    }
  }

  async handleMessage(
    messageId: string,
    headers: GmailHeaders,
  ): Promise<Issue | undefined> {
    this.logger.log(`Processing message with ID: ${messageId}`);

    // Fetch the message data from the Gmail API
    const messageData = await getRequest(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers,
    );

    const { payload, threadId } = messageData.data;

    if (!payload) {
      return undefined;
    }
    const subject = payload.headers.find(
      (header: PartHeader) => header.name === 'Subject',
    ).value;
    const deliveredTo = payload.headers.find(
      (header: PartHeader) => header.name === 'Delivered-To',
    ).value;

    // Get the team based on the delivered-to email address
    const team = await getTeam(this.prisma, deliveredTo);
    if (!team) {
      this.logger.log(`No team found for email address: ${deliveredTo}`);
      await postRequest(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}/modify`,
        headers,
        {
          removeLabelIds: ['INBOX'],
          addLabelIds: [process.env.GMAIL_OTHER_LABEL], // This id is for Label Other
        },
      );
      return undefined;
    }

    // Get the state ID for the 'opened' state of the team
    const stateId = await getState(this.prisma, 'opened', team.id);

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

    this.logger.log(`Forwarded From: ${forwardedFrom}`);

    // Convert the HTML body to Tiptap JSON format
    const tiptapJson = convertHtmlToTiptapJson(htmlBody);

    const sourceMetadata = {
      type: IntegrationName.Gmail,
      messageId,
      threadId,
      userDisplayName: forwardedFrom,
    };

    let attachmentUrls: AttachmentResponse[] = [];
    if (attachments.length > 0) {
      // Get the files buffer from Gmail using the integration account and message attachments
      const multerFiles = await getFilesBuffer(attachments, headers, messageId);
      // Upload the files to GCP and get the attachment URLs
      attachmentUrls = await this.attachmentService.uploadAttachment(
        multerFiles,
        null,
        team.workspaceId,
        sourceMetadata,
      );
    }

    // Check if the issue is already linked to a thread
    const linkedIssue = await this.prisma.linkedIssue.findUnique({
      where: { url: `https://mail.google.com/mail/u/0/#inbox/${threadId}` },
      include: { issue: true },
    });

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
      issue = await this.issuesService.updateIssueApi(
        { teamId: team.id } as TeamRequestParams,
        {
          description: JSON.stringify(tiptapJson),
          subscriberIds: linkedIssue.issue.subscriberIds,
        },
        { issueId: linkedIssue.issueId },
      );
    } else {
      // If the issue is not linked, create a new issue
      const issueInput: CreateIssueInput = {
        title: subject,
        description: JSON.stringify(tiptapJson),
        stateId,
        isBidirectional: false,
      } as CreateIssueInput;

      const linkIssueData: LinkIssueData = {
        url: `https://mail.google.com/mail/u/0/#inbox/${threadId}`,
        sourceId: threadId,
        source: sourceMetadata,
        sourceData: { messageId, threadId },
      };

      issue = await this.issuesService.createIssueAPI(
        { teamId: team.id } as TeamRequestParams,
        issueInput as CreateIssueInput,
        null,
        linkIssueData,
        sourceMetadata,
      );
    }
    this.logger.log(`Issue Id of the Gmail message: ${issue.id}`);

    const modifyResponse = await postRequest(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}/modify`,
      headers,
      { removeLabelIds: ['UNREAD', 'INBOX'] },
    );

    if (modifyResponse.status === 200) {
      this.logger.log(`Removed UNREAD label from Gmail thread: ${threadId}`);
    }

    return issue;
  }

  private async sendGmailWatchRequest() {
    try {
      await postRequest(
        'https://gmail.googleapis.com/gmail/v1/users/me/watch',
        await getHeaders(),
        {
          labelIds: ['INBOX'],
          topicName: process.env.GMAIL_PUBSUB_TOPIC,
          labelFilterBehavior: 'INCLUDE',
        },
      );
      this.logger.log('Gmail watch request successful');
    } catch (error) {
      this.logger.error('Error scheduling Gmail watch:', error);
    }
  }

  private async scheduleGmailWatch() {
    await this.sendGmailWatchRequest();
    const cronJob = new CronJob('0 0 * * *', async () => {
      await this.sendGmailWatchRequest();
    });

    cronJob.start();
  }
}
