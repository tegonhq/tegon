import * as fs from 'fs';
import * as path from 'path';

import { PrismaClient } from '@prisma/client';
import {
  ActionEventPayload,
  ActionTypesEnum,
  Issue,
  NotificationActionType,
  User,
  Workspace,
} from '@tegonhq/types';
import * as Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import {
  getIssueMetadata,
  getNotificationData,
  getUnassingedNotification,
} from '../utils';

const prisma = new PrismaClient();

const templatePath = path.join(
  __dirname,
  '../templates/notificationTemplate.hbs',
);
const templateSource = fs.readFileSync(templatePath, 'utf-8');
const template = Handlebars.compile(templateSource);

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async verify() {
    return await this.transporter.verify((err, success) => {
      if (err) {
        console.error(err);
      }
      console.log(`Your config is correct ${success}`);
    });
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: `Tegon <notification@tegon.ai>`,
      to,
      subject,
      html,
    });
  }
}

const mailService = new MailService();

export const emailHandler = async (payload: ActionEventPayload) => {
  await mailService.verify();
  switch (payload.event) {
    case ActionTypesEnum.ON_CREATE:
    case ActionTypesEnum.ON_UPDATE:
      const {
        notificationData: { userId: createdById, workspaceId },
        notificationType,
        notificationData,
      } = payload;

      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      const { type, actionData, subscriberIds } = await getNotificationData(
        prisma,
        notificationType,
        createdById,
        notificationData,
      );

      const createdBy = await prisma.user.findUnique({
        where: { id: createdById },
      });

      const unassignedData = await getUnassingedNotification(
        prisma,
        createdById,
        notificationData,
      );

      if (unassignedData) {
        const user = await prisma.user.findUnique({
          where: { id: unassignedData.fromAssigneeId },
        });
        const { url: issueUrl, identifier: issueIdentifier } =
          getIssueIdentifier(unassignedData.issue, workspace);

        const templateData = {
          workspaceName: workspace.name,
          workspaceSlug: workspace.slug,
          issueNumber: `${issueIdentifier}`,
          issueTitle: unassignedData.issue.title,
          issueUrl,
          message: `You have been unassigned from issue ${issueIdentifier} by ${createdBy.fullname}`,
        };

        mailService.sendMail({
          to: user.email,
          subject: `${createdBy.fullname} unassigned an issue from you: [${templateData.issueNumber}]`,
          html: template(templateData),
        });
      }

      if (!subscriberIds.length || !type) {
        return { message: 'No subscribers to notify' };
      }

      const relevantSubscribers = subscriberIds.filter(
        (userId) => userId !== createdById,
      );

      // Fetch all users in one query
      const users = await prisma.user.findMany({
        where: {
          id: { in: relevantSubscribers },
        },
      });

      // Send notifications in parallel
      await Promise.all(
        users.map(async (user) => {
          const emailContent = await getEmailContent(
            type,
            actionData,
            user.id,
            createdBy,
            workspace,
          );
          if (emailContent) {
            await mailService.sendMail({
              to: user.email,
              subject: emailContent.subject,
              html: emailContent.html,
            });
          }
        }),
      );

      return { message: `Sent emails to all subscribers` };

    default:
      return {
        message: `The event payload type "${payload.event}" is not recognized`,
      };
  }
};

async function getEmailContent(
  type: NotificationActionType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionData: Record<string, any>,
  userId: string,
  createdBy: User,
  workspace: Workspace,
) {
  const issue: Issue = actionData.issue
    ? actionData.issue
    : actionData.issueComment.issue;

  const { url: issueUrl, identifier: issueIdentifier } = getIssueIdentifier(
    issue,
    workspace,
  );
  switch (type) {
    case NotificationActionType.IssueAssigned:
      const templateData = {
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        issueNumber: `${issueIdentifier}`,
        issueTitle: issue.title,
        issueUrl,
        message: `${createdBy.fullname} assigned an issue to ${
          actionData.userId === userId ? 'you' : createdBy.fullname
        }`,
      };

      return {
        subject: `${createdBy.fullname} assigned an issue to you: [${templateData.issueNumber}]`,
        html: template(templateData),
      };

    case NotificationActionType.IssueBlocks:
      const issueRelation = actionData.issueRelation;
      const blockTemplateData = {
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        issueNumber: `${issueIdentifier}`,
        issueTitle: issue.title,
        issueUrl,
        message: `Issue ${issueIdentifier} is blocked by ${getIssueIdentifier(issueRelation, workspace)}`,
      };

      return {
        subject: `Issue Block Notification: [${blockTemplateData.issueNumber}]`,
        html: template(blockTemplateData),
      };

    case NotificationActionType.IssueNewComment:
      const commentTemplateData = {
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        issueNumber: `${issueIdentifier}`,
        issueTitle: issue.title,
        issueUrl,
        message: `${createdBy.fullname} commented: ${actionData.issueComment.bodyMarkdown}`,
      };

      return {
        subject: `New comment on [${commentTemplateData.issueNumber}]`,
        html: template(commentTemplateData),
      };

    case NotificationActionType.IssueStatusChanged:
      const issueMetadata = await getIssueMetadata(prisma, issue);
      const statusTemplateData = {
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        issueNumber: `${issueIdentifier}`,
        issueTitle: issue.title,
        issueUrl,
        message: `${createdBy.fullname} changed issue status to ${issueMetadata.state}`,
      };

      return {
        subject: `Status Changed: [${statusTemplateData.issueNumber}]`,
        html: template(statusTemplateData),
      };

    case NotificationActionType.IssuePriorityChanged:
      const priorityTemplateData = {
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        issueNumber: `${issueIdentifier}`,
        issueTitle: issue.title,
        issueUrl,
        message: `${createdBy.fullname} changed issue priority to ${issue.priority}`,
      };

      return {
        subject: `Priority Changed: [${priorityTemplateData.issueNumber}]`,
        html: template(priorityTemplateData),
      };

    default:
      return null;
  }
}

function getIssueIdentifier(
  issue: Issue,
  workspace: Workspace,
  title: boolean = false,
) {
  const baseIdentifier = `${issue.team.identifier}-${issue.number}`;
  const displayText = title
    ? `${baseIdentifier} ${issue.title}`
    : baseIdentifier;
  return {
    url: `https://app.tegon.ai/${workspace.slug}/issue/${baseIdentifier}`,
    identifier: displayText,
  };
}

// Add type definitions and other helper functions similar to slack-handler...
