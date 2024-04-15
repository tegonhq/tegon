/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationName } from '@prisma/client';

import { UpdateIssueInput } from 'modules/issues/issues.interface';
import { LinkIssueData } from 'modules/linked-issue/linked-issue.interface';

export const eventsToListen = new Map([
  ['issues', true],
  ['issue_comment', true],
  ['label', true],
  ['installation_repositories', true],
  ['pull_request', true],
  ['installation', true],
]);

export const githubHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export interface githubIssueData {
  linkIssueData: LinkIssueData;
  issueInput: UpdateIssueInput;
  sourceMetadata: {
    id: string;
    type: IntegrationName;
    userDisplayName: string;
  };
  userId: string | null;
}
