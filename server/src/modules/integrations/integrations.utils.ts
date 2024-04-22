/** Copyright (c) 2024, Tegon, all rights reserved. **/

import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';
import { Schema } from 'prosemirror-model';

import { AttachmentResponse } from 'modules/attachments/attachments.interface';

import {
  PostRequestBody,
  RequestHeaders,
  TiptapNode,
  labelDataType,
} from './integrations.interface';

export async function getRequest(url: string, headers: RequestHeaders) {
  try {
    const response = await axios.get(url, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}

export async function postRequest(
  url: string,
  headers: RequestHeaders,
  body: PostRequestBody,
) {
  try {
    const response = await axios.post(url, body, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error making POST request to ${url}: ${error.message}`);
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}

export async function deleteRequest(url: string, headers: RequestHeaders) {
  try {
    const response = await axios.delete(url, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error making DELETE request to ${url}: ${error.message}`);
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}

export async function getOrCreateLabelIds(
  prisma: PrismaService,
  labels: labelDataType[],
  teamId: string,
  workspaceId: string,
): Promise<string[]> {
  // Extract label names from the input
  const labelNames = labels.map((label) => label.name);

  // Find existing labels with matching names (case-insensitive)
  const existingLabels = await prisma.label.findMany({
    where: {
      name: { in: labelNames, mode: 'insensitive' },
    },
  });

  // Create a map of existing label names to their IDs
  const existingLabelMap = new Map(
    existingLabels.map((label) => [label.name.toLowerCase(), label.id]),
  );

  // Create new labels for names that don't have a match
  const newLabels = await Promise.all(
    labels
      .filter((label) => !existingLabelMap.has(label.name.toLowerCase()))
      .map((label) =>
        prisma.label.create({
          data: {
            name: label.name,
            color: `#${label.color}`,
            teamId,
            workspaceId,
          },
        }),
      ),
  );

  // Combine the IDs of existing and new labels
  return [
    ...existingLabels.map((label) => label.id),
    ...newLabels.map((label) => label.id),
  ];
}

export async function getUserId(
  prisma: PrismaService,
  userData: Record<string, string>,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId: userData?.id.toString() },
    select: { integratedById: true },
  });

  return integrationAccount?.integratedById || null;
}
// Define the Tiptap-compatible schema
const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { content: 'inline*', group: 'block' },
    text: { group: 'inline' },
    image: { attrs: { src: {}, alt: { default: null } }, group: 'block' },
  },
});

export function convertToTiptapJSON(
  message: string,
  attachmentUrls: AttachmentResponse[],
): string {
  const contentNodes = [
    schema.nodes.paragraph.create({}, schema.text(message)),
    ...(attachmentUrls || [])
      .filter((attachment) => attachment?.fileType?.startsWith('image/'))
      .map((attachment) =>
        schema.nodes.paragraph.create(
          {},
          schema.nodes.image.create({ src: attachment.publicURL }),
        ),
      ),
  ];

  const doc = schema.nodes.doc.create({}, contentNodes);

  return JSON.stringify({
    type: 'doc',
    content: doc.content.toJSON(),
  });
}

export function convertTiptapToPlainText(
  json: TiptapNode,
  ignoreImage?: boolean,
): string {
  if (json.type === 'doc') {
    return json.content
      .map((node: TiptapNode) => convertTiptapToPlainText(node))
      .join('\n');
  } else if (json.type === 'paragraph') {
    return json.content
      .map((node: TiptapNode) => convertTiptapToPlainText(node))
      .join('');
  } else if (json.type === 'text') {
    return json.text;
  } else if (json.type === 'image' && !ignoreImage) {
    return `[Image: ${json.attrs.src}]`;
  }
  return '';
}
