import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';

import {
  PostRequestBody,
  RequestHeaders,
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
      workspaceId,
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
