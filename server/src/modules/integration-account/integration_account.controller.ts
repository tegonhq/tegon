/* eslint-disable @typescript-eslint/no-explicit-any */
/** Copyright (c) 2023, Poozle, all rights reserved. **/

import {
  All,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Method } from 'axios';

import { IntegrationAccount } from '@@generated/integrationAccount/entities';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  CreateIntegrationAccountBody,
  CreateIntegrationAccountWithLinkBody,
  IntegrationAccountRequestIdBody,
  IntegrationAccountWithLinkRequestIdBody,
  IntegrationAccountsRequestBody,
  IntegrationCheckBody,
  UpdateIntegrationAccountBody,
} from './integration_account.interface';
import { IntegrationAccountService } from './integration_account.service';

@Controller({
  version: '1',
  path: 'integration_account',
})
@ApiTags('Integration Account')
@ApiBadRequestResponse({
  status: 400,
  type: 'string',
  description: 'Bad Request',
})
@ApiUnauthorizedResponse({
  status: 401,
  type: 'string',
  description: 'Not authorised',
})
export class IntegrationAccountController {
  constructor(
    private integrationAccountService: IntegrationAccountService,
  ) {}

  /**
   * Get all integration accounts in a workspace
   */
  @Get()
  @UseGuards(new AuthGuard())
  async getIntegrationAccounts(
    @Query()
    integrationAccountsRequestBody: IntegrationAccountsRequestBody,
  ): Promise<IntegrationAccount[]> {
    return await this.integrationAccountService.getIntegrationAccountsForWorkspace(
      integrationAccountsRequestBody.workspaceId,
    );
  }

  /**
   * Get a integration accounts in a workspace
   */
  @Get(':integrationAccountId')
  @UseGuards(new AuthGuard())
  async getIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountRequestIdBody,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.getIntegrationAccountWithId(
      integrationAccountIdRequestIdBody,
    );
  }

  /**
   * Delete a Integration account
   */
  @Delete(':integrationAccountId')
  @UseGuards(new AuthGuard())
  async deleteIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountRequestIdBody,
  ) {
    return await this.integrationAccountService.deleteIntegrationAccount(
      integrationAccountIdRequestIdBody,
    );
  }

  /**
   * Check credentials for a integration definition
   */
  @Post('check')
  @UseGuards(new AuthGuard())
  async checkCredentialsForIntegrationAccount(
    @Body()
    integrationCheckBody: IntegrationCheckBody,
  ): CheckResponse {
    return await this.integrationAccountService.checkForIntegrationCredentails(
      integrationCheckBody.integrationDefinitionId,
      integrationCheckBody.config,
      integrationCheckBody.authType,
      integrationCheckBody.workspaceId,
    );
  }

  /**
   * Update a integration account in workspace
   */
  @Post(':integrationAccountId')
  @UseGuards(new AuthGuard())
  async updateIntegrationAccount(
    @Param()
    integrationAccountIdRequestIdBody: IntegrationAccountRequestIdBody,
    @Body()
    updateIntegrationAccountBody: UpdateIntegrationAccountBody,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.updateIntegrationAccount(
      integrationAccountIdRequestIdBody.integrationAccountId,
      updateIntegrationAccountBody,
    );
  }

  /**
   * Create integration account in a workspace
   */
  @Post()
  @UseGuards(new AuthGuard())
  async createIntegrationAccount(
    @Body()
    createIntegrationAccountBody: CreateIntegrationAccountBody,
  ): Promise<IntegrationAccount> {
    return await this.integrationAccountService.createIntegrationAccount(
      createIntegrationAccountBody,
    );
  }

  /**
   * Get integration account for a link
   */
  @Post('link/:linkId')
  async createIntegrationAccountWithLink(
    @Param()
    integrationAccountWithLinkRequestIdBody: IntegrationAccountWithLinkRequestIdBody,
    @Body()
    createIntegrationAccountBody: CreateIntegrationAccountWithLinkBody,
  ): Promise<IntegrationAccount> {
    const link = await this.linkService.getLink(
      integrationAccountWithLinkRequestIdBody,
    );

    if (link.expired) {
      throw new BadRequestException('Link has expired');
    }

    return await this.integrationAccountService.createIntegrationAccountWithLink(
      createIntegrationAccountBody.integrationDefinitionId,
      createIntegrationAccountBody.config,
      createIntegrationAccountBody.integrationAccountName,
      createIntegrationAccountBody.authType,
      link.workspaceId,
      link.linkId,
      createIntegrationAccountBody.accountIdentifier,
    );
  }

  /**
   * Proxy all the calls to the integration directly
   */
  @All(':integrationAccountId/proxy/*')
  @UseGuards(new AuthGuard())
  async proxy(
    @Body()
    body: any,
    @Query()
    query: any,
    @Req() request: Request,
    @Param()
    integrationAccountIdRequestIdBody: any,
  ): Promise<any> {
    return await this.integrationAccountService.runProxyCommand(
      integrationAccountIdRequestIdBody.integrationAccountId,
      body,
      request.method as Method,
      integrationAccountIdRequestIdBody['0'],
      query,
    );
  }
}
