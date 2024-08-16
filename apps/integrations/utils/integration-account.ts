import axios from 'axios';

export async function getIntegrationAccount(accountId: string) {
  const { data } = await axios.get(
    `${process.env.BACKEND_HOST}/v1/integration_account/account_id?accountId=${accountId}`,
  );

  return data;
}
