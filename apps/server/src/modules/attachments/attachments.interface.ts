import { IsOptional, IsString } from 'class-validator';

export class AttachmentRequestParams {
  @IsString()
  workspaceId: string;

  @IsString()
  attachmentId: string;
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

export class AttachmentBody {
  @IsOptional()
  @IsString()
  sourceMetadata: string;
}
