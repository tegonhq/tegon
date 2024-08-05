import { InputJsonValue } from '../../common';

export class CreateIntegrationAccountDto {
  deleted?: Date;
  integrationConfiguration: InputJsonValue;
  accountId?: string;
  settings?: InputJsonValue;
}
