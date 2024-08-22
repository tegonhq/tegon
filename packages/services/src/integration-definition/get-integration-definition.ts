import {
  IntegrationDefinition,
  IntegrationDefinitionIdDto,
} from '@tegonhq/types';
import axios from 'axios';

export async function getIntegrationDefinition({
  integrationDefinitionId,
}: IntegrationDefinitionIdDto): Promise<IntegrationDefinition> {
  const response = await axios.get(
    `/api/v1/integration_definition/${integrationDefinitionId}`,
  );

  return response.data;
}
