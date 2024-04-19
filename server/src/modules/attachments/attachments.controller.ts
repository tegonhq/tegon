/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import {
  AttachmentRequestParams,
  TeamRequestParams,
} from './attachments.interface';
import { AttachmentService } from './attachments.service';

@Controller({
  version: '1',
  path: 'attachment',
})
@ApiTags('attachment')
export class AttachmentController {
  constructor(private readonly attachementService: AttachmentService) {}

  @Post('upload/:teamId')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(new AuthGuard())
  async uploadFiles(
    @SessionDecorator() session: SessionContainer,
    @Param() teamRequestParams: TeamRequestParams,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = session.getUserId();

    return this.attachementService.uploadToGCP(
      files,
      userId,
      teamRequestParams.teamId,
    );
  }

  @Get(':teamId/:attachmentId')
  async getFileFromGCS(
    @Param() attachementRequestParams: AttachmentRequestParams,
    @Res() res: Response,
  ) {
    try {
      const file = await this.attachementService.getFileFromGCS(
        attachementRequestParams,
      );
      res.setHeader('Content-Type', file.contentType);
      res.send(file.buffer);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Delete(':teamId/:attachmentId')
  @UseGuards(new AuthGuard())
  async deleteAttachment(
    @Param() attachementRequestParams: AttachmentRequestParams,
  ) {
    await this.attachementService.deleteAttachment(attachementRequestParams);
    return { message: 'Attachment deleted successfully' };
  }
}
