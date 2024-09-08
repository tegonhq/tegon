import {
  AccountIdDto,
  IntegrationAccount,
  IntegrationAccountIdDto,
  PersonalAccountDto,
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
    `/api/v1/integration_account/accountId?accountId=${accountId}`,
  );

  return response.data;
}

export async function getPersonalIntegrationAccount(
  data: PersonalAccountDto,
): Promise<IntegrationAccount> {
  const { workspaceId, userId, definitionSlug } = data;
  const response = await axios.get(
    `/api/v1/integration_account/personal?workspaceId=${workspaceId}&userId=${userId}&definitionSlug=${definitionSlug}`,
  );

  return response.data;
}
