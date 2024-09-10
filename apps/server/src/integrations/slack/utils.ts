import axios from 'axios';

export async function getSlackTeamInfo(slackTeamId: string, apiKey: string) {
  const response = await axios.get(
    `https://slack.com/api/team.info?team=${slackTeamId}`,
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  return response.data;
}
