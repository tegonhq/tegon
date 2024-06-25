/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { Readable } from 'stream';

import { PrismaService } from 'nestjs-prisma';

import { GmailAttachment, GmailHeaders } from './gmail.interface';
import { getRequest, postRequest } from '../integrations.utils';

export async function getHeaders(): Promise<GmailHeaders> {
  const accessToken = await getGMailAccessToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export async function getGMailAccessToken() {
  const accessResponse = await postRequest(
    'https://oauth2.googleapis.com/token',
    { headers: {} },
    {
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      redirect_uri: process.env.GMAIL_REDIRECT_URI,
    },
  );

  return accessResponse.data.access_token;
}

export async function extractForwardHtml(htmlBody: string) {
  const forwardedFromRegex =
    /From: <strong class="gmail_sendername" dir="auto">(.*?)<\/strong>/;
  const forwardedDateRegex = /Date: (.*?)<br>/;
  const forwardedSubjectRegex = /Subject: (.*?)<br>/;
  const forwardedToRegex = /To:.*?&lt;(.*?)&gt;<br>/;

  const forwardedFromMatch = htmlBody.match(forwardedFromRegex);
  const forwardedDateMatch = htmlBody.match(forwardedDateRegex);
  const forwardedSubjectMatch = htmlBody.match(forwardedSubjectRegex);
  const forwardedToMatch = htmlBody.match(forwardedToRegex);

  const details = {
    forwardedFrom: forwardedFromMatch ? forwardedFromMatch[1] : '',
    forwardedDate: forwardedDateMatch ? forwardedDateMatch[1] : '',
    forwardedSubject: forwardedSubjectMatch ? forwardedSubjectMatch[1] : '',
    forwardedTo: forwardedToMatch ? forwardedToMatch[1] : '',
  };

  return details;
}

export async function getFilesBuffer(
  attachments: GmailAttachment[],
  headers: GmailHeaders,
  messageId: string,
): Promise<Express.Multer.File[]> {
  const mutterFiles = await Promise.all(
    attachments.map(async (attachment) => {
      const attachmentResponse = await getRequest(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachment.attachmentId}`,
        headers,
      );

      const base64Data = attachmentResponse.data.data
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const fileBuffer = Buffer.from(base64Data, 'base64');

      const multerFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: attachment.filename,
        encoding: '7bit',
        mimetype: attachment.mimetype,
        size: attachmentResponse.data.size,
        buffer: fileBuffer,
        destination: '',
        filename: attachment.filename,
        path: '',
        stream: new Readable(),
      };

      return multerFile;
    }),
  );

  return mutterFiles;
}

export async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;

  if (category) {
    const workflow = await prisma.workflow.findFirst({
      where: { teamId, category },
      orderBy: { position: 'asc' },
    });
    return workflow?.id;
  }

  return undefined;
}

export async function getTeam(prisma: PrismaService, deliveredTo: string) {
  let teamId = null;
  if (deliveredTo) {
    const matches = deliveredTo.match(
      /\+([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})@/i,
    );
    if (matches && matches[1]) {
      [, teamId] = matches;
    }
  }
  if (!teamId) {
    return undefined;
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { workspace: true },
  });

  return team;
}
