import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateLabelDto,
  Label,
  LabelRequestParamsDto,
  UpdateLabelDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import { RequestIdParams } from './labels.interface';
import LabelsService from './labels.service';

@Controller({
  version: '1',
  path: 'labels',
})
@ApiTags('Labels')
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createLabel(@Body() labelData: CreateLabelDto): Promise<Label> {
    return await this.labelsService.createLabel(labelData);
  }

  @Get()
  @UseGuards(new AuthGuard())
  async getAllLabels(
    @Query() requestParams: RequestIdParams,
  ): Promise<Label[]> {
    return await this.labelsService.getAllLabels(requestParams);
  }

  @Get(':labelId')
  @UseGuards(new AuthGuard())
  async getLabel(
    @Param()
    labelId: LabelRequestParamsDto,
  ): Promise<Label> {
    return await this.labelsService.getLabel(labelId);
  }

  @Post(':labelId')
  @UseGuards(new AuthGuard())
  async updateLabel(
    @Param()
    labelId: LabelRequestParamsDto,
    @Body() labelData: UpdateLabelDto,
  ): Promise<Label> {
    return await this.labelsService.updateLabel(labelId, labelData);
  }

  @Delete(':labelId')
  @UseGuards(new AuthGuard())
  async deleteLabel(
    @Param()
    labelId: LabelRequestParamsDto,
  ): Promise<Label> {
    return await this.labelsService.deleteLabel(labelId);
  }
}
