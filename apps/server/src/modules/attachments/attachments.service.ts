import { Storage } from '@google-cloud/storage';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AttachmentResponse,
  AttachmentStatusEnum,
  SignedURLBody,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { LoggerService } from 'modules/logger/logger.service';

import { AttachmentRequestParams, ExternalFile } from './attachments.interface';
@Injectable()
export class AttachmentService {
  private storage: Storage;
  private bucketName = process.env.GCP_BUCKET_NAME;
  private readonly logger: LoggerService = new LoggerService(
    'AttachmentService',
  );

  constructor(private prisma: PrismaService) {
    this.storage = new Storage({
      keyFilename: process.env.GCP_SERVICE_ACCOUNT_FILE,
    });
  }

  async uploadGenerateSignedURL(
    file: SignedURLBody,
    userId: string,
    workspaceId: string,
  ) {
    const bucket = this.storage.bucket(this.bucketName);
    const attachment = await this.prisma.attachment.create({
      data: {
        fileName: file.fileName,
        originalName: file.originalName,
        fileType: file.mimetype,
        size: file.size,
        status: AttachmentStatusEnum.Pending,
        fileExt: file.originalName.split('.').pop(),
        workspaceId,
        ...(userId ? { uploadedById: userId } : {}),
      },
      include: {
        workspace: true,
      },
    });

    try {
      const [url] = await bucket
        .file(`${workspaceId}/${attachment.id}.${attachment.fileExt}`)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          contentType: file.contentType,
        });

      const publicURL = `${process.env.PUBLIC_ATTACHMENT_URL}/v1/attachment/${workspaceId}/${attachment.id}`;

      return {
        url,
        attachment: {
          publicURL,
          id: attachment.id,
          fileType: attachment.fileType,
          originalName: attachment.originalName,
          size: attachment.size,
        },
      };
    } catch (err) {
      this.logger.error(err);

      return undefined;
    }
  }

  async uploadAttachment(
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
          status: AttachmentStatusEnum.Pending,
          fileExt: file.originalname.split('.').pop(),
          workspaceId,
          sourceMetadata,
          ...(userId ? { uploadedById: userId } : {}),
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

      const publicURL = `${process.env.PUBLIC_ATTACHMENT_URL}/v1/attachment/${workspaceId}/${attachment.id}`;
      await this.prisma.attachment.update({
        where: { id: attachment.id },
        data: { status: AttachmentStatusEnum.Uploaded, url: publicURL },
      });

      return {
        publicURL,
        fileType: attachment.fileType,
        originalName: attachment.originalName,
        size: attachment.size,
      } as AttachmentResponse;
    });

    return await Promise.all(attachmentPromises);
  }

  async createExternalAttachment(
    files: ExternalFile[],
    userId: string,
    workspaceId: string,
    sourceMetadata?: Record<string, string>,
  ) {
    const attachmentPromises = files.map(async (file) => {
      const attachment = await this.prisma.attachment.create({
        data: {
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          size: file.size,
          status: AttachmentStatusEnum.External,
          fileExt: file.originalname.split('.').pop(),
          uploadedById: userId,
          workspaceId,
          url: file.url,
          sourceMetadata,
        },
        include: {
          workspace: true,
        },
      });

      return {
        publicURL: file.url,
        fileType: attachment.fileType,
        originalName: attachment.originalName,
        size: attachment.size,
      } as AttachmentResponse;
    });

    return await Promise.all(attachmentPromises);
  }

  async getFileFromGCS(
    attachementRequestParams: AttachmentRequestParams,
    workspaceId: string,
  ) {
    const { attachmentId } = attachementRequestParams;

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

  async getFileFromGCSSignedUrl(
    attachementRequestParams: AttachmentRequestParams,
    workspaceId: string,
  ) {
    const { attachmentId } = attachementRequestParams;

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
    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (!exists) {
      throw new BadRequestException('File not found');
    }

    // Get file metadata for size
    const [metadata] = await file.getMetadata();

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
      // Enable range requests and other necessary headers
      responseDisposition: 'inline',
      responseType: attachment.fileType,
    });

    return {
      signedUrl,
      contentType: attachment.fileType,
      originalName: attachment.originalName,
      size: metadata.size,
    };
  }

  async deleteAttachment(
    attachementRequestParams: AttachmentRequestParams,
    workspaceId: string,
  ) {
    const { attachmentId } = attachementRequestParams;

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
            status: AttachmentStatusEnum.Deleted,
          },
        }),
      ]);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting attachment');
    }
  }
}
