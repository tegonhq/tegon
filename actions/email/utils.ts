import { IntegrationAccount, JsonObject, Workflow } from '@tegonhq/sdk';
import axios from 'axios';
import { GmailAttachment, GmailHeaders } from 'types';

import { Blockquote } from '@tiptap/extension-blockquote';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { generateJSON } from '@tiptap/html';

import fs from 'fs';
import FormData from 'form-data';

export async function getHeaders(
  integrationAccount: IntegrationAccount,
): Promise<GmailHeaders> {
  const integrationConfig =
    integrationAccount.integrationConfiguration as JsonObject;
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${integrationConfig.token}`,
    },
  };
}

export async function getUniqueId(deliveredTo: string) {
  let mappingKey = null;
  if (deliveredTo) {
    const matches = deliveredTo.match(/\+([^-]+)-([^@]+)@/i);
    if (matches && matches.length === 3) {
      [, , mappingKey] = matches;
    }
  }
  if (!mappingKey) {
    return undefined;
  }

  return mappingKey;
}

export function getStateId(action: string, workflowStates: Workflow[]) {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;
  if (category) {
    const workflow = workflowStates.find(
      (workflow) => workflow.category === category,
    );
    return workflow?.id;
  }

  return undefined;
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

export function convertHtmlToTiptapJson(html: string) {
  const extensions = [
    Document,
    Text,
    Paragraph,
    Heading,
    Blockquote,
    ListItem,
    OrderedList,
    BulletList,
    TaskList,
    TaskItem,
    Image,
    CodeBlock,
    HardBreak,
    HorizontalRule,
    Link,
    Underline,
  ];
  const tiptapJson = generateJSON(html, extensions);
  return tiptapJson;
}

export async function getFilesFormdata(
  attachments: GmailAttachment[],
  headers: GmailHeaders,
  messageId: string,
) {
  const formData = new FormData();

  // Retrieve the files buffer for each file
  await Promise.all(
    attachments.map(async (attachment) => {
      const response = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachment.attachmentId}`,
        { ...headers, responseType: 'stream' },
      );

      const tempFilePath = `/tmp/${attachment.filename}`;
      const writeStream = fs.createWriteStream(tempFilePath);

      await new Promise((resolve, reject) => {
        response.data.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      formData.append('files', fs.createReadStream(tempFilePath));

      return tempFilePath;
    }),
  );

  return formData;
}
