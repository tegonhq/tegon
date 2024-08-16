import { IsString } from 'class-validator';

export class IntegrationAccountIdDto {
  @IsString()
  integrationAccountId: string;
}

export class AccountIdDto {
  @IsString()
  accountId: string;
}
