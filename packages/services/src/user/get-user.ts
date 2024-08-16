import axios from 'axios';

export async function getUser() {
  const response = await axios.get(`/api/v1/users`);

  return response.data;
}
