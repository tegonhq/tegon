/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

export class WorkspaceRequestParams {
  @IsString()
  workspaceId: string;
}

export class AttachmentRequestParams {
  @IsString()
  workspaceId: string;

  @IsString()
  attachmentId: string;
}

export interface AttachmentResponse {
  publicURL: string;
  fileType: string;
  originalName: string;
  size: number;
}
