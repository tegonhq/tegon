/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

export class WorkspaceQueryParams {
  @IsString()
  workspaceId: string;
}

export class IntegrationAccountQueryParams {
  @IsString()
  integrationAccountId: string;
}

export class ChannelBody {
  @IsString()
  redirectURL: string;
}
