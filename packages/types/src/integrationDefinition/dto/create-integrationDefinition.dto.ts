import { InputJsonValue } from '../../common';
import { IntegrationName } from '../entities';

export class CreateIntegrationDefinitionDto {
  deleted?: Date;
  // @ApiProperty({ enum: IntegrationName })
  name: IntegrationName;
  icon: string;
  spec: InputJsonValue;
  clientId: string;
  clientSecret: string;
  scopes: string;
}
