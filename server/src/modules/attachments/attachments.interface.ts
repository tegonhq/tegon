/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

export class TeamRequestParams {
  @IsString()
  teamId: string;
}

export class AttachmentRequestParams {
  @IsString()
  teamId: string;

  @IsString()
  attachmentId: string;
}

export interface BufferedFile {
  fileName: string;
  originalname: string;
  encoding: string;
  fileType: string;
  size: number;
  buffer: Buffer | string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

export interface HasFile {
  file: Buffer | string;
}
export interface StoredFileMetadata {
  id: string;
  name: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export type AppMimeType = 'image/png' | 'image/jpeg';
