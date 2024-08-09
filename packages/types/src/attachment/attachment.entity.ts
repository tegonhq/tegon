import { JsonValue } from '../common';
import { User } from '../user';
import { Workspace } from '../workspace';

export enum AttachmentStatusEnum {
  Pending = 'Pending',
  Failed = 'Failed',
  Uploaded = 'Uploaded',
  Deleted = 'Deleted',
  External = 'External',
}

export const AttachmentStatus = {
  Pending: 'Pending',
  Failed: 'Failed',
  Uploaded: 'Uploaded',
  Deleted: 'Deleted',
  External: 'External',
};

export type AttachmentStatus =
  (typeof AttachmentStatus)[keyof typeof AttachmentStatus];

export class Attachment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  fileName: string | null;
  originalName: string;
  fileType: string;
  fileExt: string;
  size: number;
  url: string | null;
  status: AttachmentStatus;
  sourceMetadata: JsonValue | null;
  uploadedBy?: User | null;
  uploadedById: string | null;
  workspace?: Workspace | null;
  workspaceId: string | null;
}
