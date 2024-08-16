import {
  AccountIdDto,
  IntegrationAccount,
  IntegrationAccountIdDto,
} from '@tegonhq/types';
import axios from 'axios';

export async function getIntegrationAccount({
  integrationAccountId,
}: IntegrationAccountIdDto): Promise<IntegrationAccount[]> {
  const response = await axios.get(
    `/api/v1/integration_account/${integrationAccountId}`,
  );

  return response.data;
}

export async function getIntegrationAccountByAccountId({
  accountId,
}: AccountIdDto): Promise<IntegrationAccount[]> {
  const response = await axios.get(
    `/v1/integration_account/accountId?accountId=${accountId}`,
  );

  return response.data;
}
