// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const webhookRespose = async (eventBody: any) => {
  if (eventBody.type === 'url_verification') {
    return { challenge: eventBody.challenge };
  }

  return true;
};
