import { InputJsonValue } from '../../common';

export class UpdateIntegrationAccountDto {
  deleted?: Date;
  integrationConfiguration?: InputJsonValue;
  accountId?: string;
  settings?: InputJsonValue;
}
