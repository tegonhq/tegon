import axios from 'axios';
import Configstore from 'configstore';

export const config = new Configstore('Tegon');

export const setToken = (token: string) => {
  config.set('token', token);
};

export const getToken = () => {
  return config.get('token');
};

export async function getTokenFromAPI({
  userAccountId,
  userId,
}: {
  userAccountId?: string;
  userId?: string;
}) {
  const { data } = await axios.post(
    `${process.env.BACKEND_HOST}/v1/triggerdev/generate_jwt`,
    { userAccountId, userId },
    {
      headers: { 'x-api-key': process.env.TRIGGER_TOKEN },
    },
  );

  return { token: data.token, userId: data.userId };
}
