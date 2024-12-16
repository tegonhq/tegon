import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SignedURLBody } from '@tegonhq/types';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import {
  Session as SessionDecorator,
  UserId,
  Workspace,
} from 'modules/auth/session.decorator';

import {
  AttachmentRequestParams,
  AttachmentBody,
} from './attachments.interface';
import { AttachmentService } from './attachments.service';

@Controller({
  version: '1',
  path: 'attachment',
})
export class AttachmentController {
  constructor(private readonly attachementService: AttachmentService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  async uploadFiles(
    @SessionDecorator() session: SessionContainer,
    @Workspace() workspaceId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() attachmentBody: AttachmentBody,
  ) {
    const userId = session.getUserId();

    const sourceMetadata = attachmentBody.sourceMetadata
      ? JSON.parse(attachmentBody.sourceMetadata)
      : null;

    return await this.attachementService.uploadAttachment(
      files,
      userId,
      workspaceId,
      sourceMetadata,
    );
  }

  @Post('get-signed-url')
  @UseGuards(AuthGuard)
  async getUploadSignedUrl(
    @Body() attachmentBody: SignedURLBody,
    @Workspace() workspaceId: string,
    @UserId() userId: string,
  ) {
    return await this.attachementService.uploadGenerateSignedURL(
      attachmentBody,
      userId,
      workspaceId,
    );
  }

  @Get('get-signed-url/:attachmentId')
  @UseGuards(AuthGuard)
  async getFileFromGCSSignedURL(
    @Workspace() workspaceId: string,
    @Param() attachementRequestParams: AttachmentRequestParams,
  ) {
    try {
      return await this.attachementService.getFileFromStorageSignedUrl(
        attachementRequestParams,
        workspaceId,
      );
    } catch (error) {
      return undefined;
    }
  }

  @Get(':workspaceId/:attachmentId')
  @UseGuards(AuthGuard)
  async getFileFromGCS(
    @Workspace() workspaceId: string,
    @Param() attachementRequestParams: AttachmentRequestParams,
    @Res() res: Response,
  ) {
    try {
      const file = await this.attachementService.getFileFromStorage(
        attachementRequestParams,
        workspaceId,
      );
      res.setHeader('Content-Type', file.contentType);
      res.send(file.buffer);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Delete(':workspaceId/:attachmentId')
  @UseGuards(AuthGuard)
  async deleteAttachment(
    @Workspace() workspaceId: string,
    @Param() attachementRequestParams: AttachmentRequestParams,
  ) {
    await this.attachementService.deleteAttachment(
      attachementRequestParams,
      workspaceId,
    );
    return { message: 'Attachment deleted successfully' };
  }
}
