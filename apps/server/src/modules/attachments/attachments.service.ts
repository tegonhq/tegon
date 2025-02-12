import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Attachment,
  AttachmentResponse,
  AttachmentStatusEnum,
  SignedURLBody,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid'; // Add this import at the top with other imports

import { LoggerService } from 'modules/logger/logger.service';

import { AttachmentRequestParams } from './attachments.interface';
import { StorageProvider } from './storage-provider.interface';
import { StorageFactory } from './storage.factory';
@Injectable()
export class AttachmentService {
  private readonly logger: LoggerService = new LoggerService(
    'AttachmentService',
  );
  private storageProvider: StorageProvider;

  constructor(
    private prisma: PrismaService,
    private storageFactory: StorageFactory,
  ) {
    this.storageProvider = this.storageFactory.createStorageProvider();
  }

  async uploadGenerateSignedURL(
    file: SignedURLBody,
    userId: string,
    workspaceId: string,
  ) {
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
      const filePath = this.getFilePath(workspaceId, attachment);
      const url = await this.storageProvider.getSignedUrl(filePath, {
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType: file.contentType,
      });

      const publicURL = `${process.env.PUBLIC_ATTACHMENT_URL}/v1/attachment/${attachment.id}`;

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

      const filePath = this.getFilePath(workspaceId, attachment);
      await this.storageProvider.uploadFile(filePath, file.buffer, {
        contentType: file.mimetype,
        resumable: false,
        validation: false,
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

  async uploadActionFile(file: Express.Multer.File): Promise<string> {
    const uniqueId = uuidv4(); //
    const filePath = `actions/${uniqueId}.js`;
    await this.storageProvider.uploadFile(filePath, file.buffer, {
      contentType: file.mimetype,
      resumable: false,
      validation: false,
    });

    return `${process.env.PUBLIC_ATTACHMENT_URL}/v1/attachment/actions/${uniqueId}`;
  }

  async getFileForAction(attachementRequestParams: AttachmentRequestParams) {
    const filePath = `actions/${attachementRequestParams.attachmentId}.js`;

    if (!(await this.storageProvider.fileExists(filePath))) {
      throw new BadRequestException('File not found');
    }

    const metadata = await this.storageProvider.getMetadata(filePath);
    const signedUrl = await this.storageProvider.getSignedUrl(filePath, {
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
      responseDisposition: 'inline',
    });

    return {
      signedUrl,
      size: metadata.size,
    };
  }

  async getFileFromStorage(
    attachementRequestParams: AttachmentRequestParams,
    workspaceId: string,
  ) {
    const attachment = await this.getAttachment(
      attachementRequestParams.attachmentId,
      workspaceId,
    );
    const filePath = this.getFilePath(workspaceId, attachment);

    if (!(await this.storageProvider.fileExists(filePath))) {
      throw new BadRequestException('File not found');
    }

    const buffer = await this.storageProvider.downloadFile(filePath);
    return {
      buffer,
      contentType: attachment.fileType,
      originalName: attachment.originalName,
    };
  }

  async getFileFromStorageSignedUrl(
    attachementRequestParams: AttachmentRequestParams,
    workspaceId: string,
  ) {
    const attachment = await this.getAttachment(
      attachementRequestParams.attachmentId,
      workspaceId,
    );
    const filePath = this.getFilePath(workspaceId, attachment);

    if (!(await this.storageProvider.fileExists(filePath))) {
      throw new BadRequestException('File not found');
    }

    const metadata = await this.storageProvider.getMetadata(filePath);
    const signedUrl = await this.storageProvider.getSignedUrl(filePath, {
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
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
    const attachment = await this.getAttachment(
      attachementRequestParams.attachmentId,
      workspaceId,
    );
    const filePath = this.getFilePath(workspaceId, attachment);

    try {
      await Promise.all([
        this.storageProvider.deleteFile(filePath),
        this.prisma.attachment.update({
          where: { id: attachementRequestParams.attachmentId },
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

  private async getAttachment(attachmentId: string, workspaceId: string) {
    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, workspaceId },
    });

    if (!attachment) {
      throw new BadRequestException('Attachment not found');
    }

    return attachment;
  }

  private getFilePath(workspaceId: string, attachment: Attachment): string {
    return `${workspaceId}/${attachment.id}.${attachment.fileExt}`;
  }
}
