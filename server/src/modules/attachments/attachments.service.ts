/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Storage } from '@google-cloud/storage';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AttachmentStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { AttachmentRequestParams } from './attachments.interface';

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
    teamId: string,
  ) {
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
          teamId,
        },
        include: {
          team: true,
        },
      });

      const bucket = this.storage.bucket(this.bucketName);
      const blob = bucket.file(
        `${attachment.team.workspaceId}/${teamId}/${attachment.id}.${attachment.fileExt}`,
      );
      const blobStream = blob.createWriteStream({
        resumable: false,
        validation: false,
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          console.error('Error uploading file:', err);
          reject(new BadRequestException('Error uploading file'));
        });

        blobStream.on('finish', async () => {
          await this.prisma.attachment.update({
            where: { id: attachment.id },
            data: { status: AttachmentStatus.Uploaded },
          });
          const publicUrl = `${process.env.PUBLIC_ATTACHMENT_URL}/v1/attachment/${attachment.teamId}/${attachment.id}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    });

    const attachments = await Promise.all(attachmentPromises);
    return attachments;
  }

  async getFileFromGCS(attachementRequestParams: AttachmentRequestParams) {
    const attachement = await this.prisma.attachment.findUnique({
      where: {
        id: attachementRequestParams.attachmentId,
        teamId: attachementRequestParams.teamId,
      },
      include: {
        team: true,
      },
    });
    if (!attachement) {
      throw new BadRequestException(
        `No attachment found for this id: ${attachementRequestParams.attachmentId}`,
      );
    }
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(
      `${attachement.team.workspaceId}/${attachement.teamId}/${attachement.id}.${attachement.fileExt}`,
    );

    const [exists] = await blob.exists();
    if (!exists) {
      throw new BadRequestException('File not found');
    }

    const [buffer] = await blob.download();
    return {
      buffer,
      contentType: blob.metadata.contentType,
      originalName: attachement.originalName,
    };
  }

  async deleteAttachment(attachementRequestParams: AttachmentRequestParams) {
    const { attachmentId, teamId } = attachementRequestParams;
    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, teamId },
      include: { team: true },
    });

    if (!attachment) {
      throw new BadRequestException('Attachment not found');
    }

    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(
      `${attachment.team.workspaceId}/${teamId}/${attachment.id}.${attachment.fileExt}`,
    );

    try {
      await blob.delete();
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file from GCS');
    }

    await this.prisma.attachment.update({
      where: { id: attachmentId },
      data: {
        deleted: new Date().toISOString(),
        status: AttachmentStatus.Deleted,
      },
    });
  }
}
