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

export interface ExternalFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  url: string;
}
