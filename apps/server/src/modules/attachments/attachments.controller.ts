import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
  AttachmentQueryParams,
  AttachmentBody,
} from './attachments.interface';
import { AttachmentService } from './attachments.service';

@Controller({
  version: '1',
  path: 'attachment',
})
@ApiTags('attachment')
export class AttachmentController {
  constructor(private readonly attachementService: AttachmentService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  async uploadFiles(
    @SessionDecorator() session: SessionContainer,
    @Query() attachmentQueryParams: AttachmentQueryParams,
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
      attachmentQueryParams.workspaceId,
      sourceMetadata,
    );
  }

  @Get(':workspaceId/:attachmentId')
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

  @Delete(':workspaceId/:attachmentId')
  @UseGuards(AuthGuard)
  async deleteAttachment(
    @Param() attachementRequestParams: AttachmentRequestParams,
  ) {
    await this.attachementService.deleteAttachment(attachementRequestParams);
    return { message: 'Attachment deleted successfully' };
  }
}
