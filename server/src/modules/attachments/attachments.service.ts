/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Storage } from '@google-cloud/storage';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AttachmentStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  AttachmentRequestParams,
  AttachmentResponse,
} from './attachments.interface';

@Injectable()
export class AttachmentService {
  private storage: Storage;
  private bucketName = process.env.GCP_BUCKET_NAME;

  constructor(private prisma: PrismaService) {
    this.storage = new Storage({
      keyFilename: process.env.GCP_SERVICE_ACCOUNT_FILE,
    });
  }

  async uploadToGCP(
    files: Express.Multer.File[],
    userId: string,
    workspaceId: string,
    sourceMetadata?: Record<string, string>,
  ): Promise<AttachmentResponse[]> {
    const bucket = this.storage.bucket(this.bucketName);

    const attachmentPromises = files.map(async (file) => {
      const attachment = await this.prisma.attachment.create({
        data: {
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          size: file.size,
          status: AttachmentStatus.Pending,
          fileExt: file.originalname.split('.').pop(),
          uploadedById: userId,
          workspaceId,
          sourceMetadata,
        },
        include: {
          workspace: true,
        },
      });

      const blob = bucket.file(
        `${workspaceId}/${attachment.id}.${attachment.fileExt}`,
      );
      await blob.save(file.buffer, {
        resumable: false,
        validation: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      await this.prisma.attachment.update({
        where: { id: attachment.id },
        data: { status: AttachmentStatus.Uploaded },
      });

      return {
        publicURL: `${process.env.PUBLIC_ATTACHMENT_URL}/v1/attachment/${workspaceId}/${attachment.id}`,
        fileType: attachment.fileType,
        originalName: attachment.originalName,
        size: attachment.size,
      } as AttachmentResponse;
    });

    return await Promise.all(attachmentPromises);
  }

  async getFileFromGCS(attachementRequestParams: AttachmentRequestParams) {
    const { attachmentId, workspaceId } = attachementRequestParams;

    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, workspaceId },
    });

    if (!attachment) {
      throw new BadRequestException(
        `No attachment found for this id: ${attachmentId}`,
      );
    }

    const bucket = this.storage.bucket(this.bucketName);
    const filePath = `${workspaceId}/${attachment.id}.${attachment.fileExt}`;
    const [fileExists] = await bucket.file(filePath).exists();

    if (!fileExists) {
      throw new BadRequestException('File not found');
    }

    const [buffer] = await bucket.file(filePath).download();

    return {
      buffer,
      contentType: attachment.fileType,
      originalName: attachment.originalName,
    };
  }

  async deleteAttachment(attachementRequestParams: AttachmentRequestParams) {
    const { attachmentId, workspaceId } = attachementRequestParams;

    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, workspaceId },
    });

    if (!attachment) {
      throw new BadRequestException('Attachment not found');
    }

    const filePath = `${workspaceId}/${attachment.id}.${attachment.fileExt}`;

    try {
      await Promise.all([
        this.storage.bucket(this.bucketName).file(filePath).delete(),
        this.prisma.attachment.update({
          where: { id: attachmentId },
          data: {
            deleted: new Date().toISOString(),
            status: AttachmentStatus.Deleted,
          },
        }),
      ]);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting attachment');
    }
  }
}
