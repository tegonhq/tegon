interface WhatsAppWebhookQuery {
  'hub.mode'?: string;
  'hub.challenge'?: string;
  'hub.verify_token'?: string;
}

export const webhookResponse = async (
  query: WhatsAppWebhookQuery,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
) => {
  // Handle webhook verification
  console.log(query);
  if (query['hub.mode'] === 'subscribe') {
    // Return the challenge value to confirm the webhook
    return parseInt(query['hub.challenge'] || '0', 10);
  }

  // Handle other webhook events
  if (body.object === 'whatsapp_business_account') {
    // Process WhatsApp webhook events
    return true;
  }

  return true;
};
