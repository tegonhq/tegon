import nodeCrypto from 'node:crypto';

import axios from 'axios';

export function encryptToken(value: string) {
  const nonce = nodeCrypto.randomBytes(12);
  const cipher = nodeCrypto.createCipheriv(
    'aes-256-gcm',
    process.env.TRIGGER_TOKEN,
    nonce,
  );

  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag().toString('hex');

  return {
    nonce: nonce.toString('hex'),
    ciphertext: encrypted,
    tag,
  };
}

export function hashToken(token: string): string {
  const hash = nodeCrypto.createHash('sha256');
  hash.update(token);
  return hash.digest('hex');
}

export async function getRuns(taskId: string, apiKey: string) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v1/runs?filter[taskIdentifier]=${taskId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getRun(runId: string, apiKey: string) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v3/runs/${runId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return { data: [] };
  }
}

export async function replayRun(runId: string, apiKey: string) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v1/runs/${runId}/replay`;

  try {
    const response = await axios.post(url, undefined, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return { data: [] };
  }
}

export async function cancelRun(runId: string, apiKey: string) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v3/runs/${runId}/cancel`;

  try {
    const response = await axios.post(url, undefined, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return { data: [] };
  }
}

export async function triggerTask(
  taskId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  apiKey: string,
  options?: Record<string, string>,
) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v1/tasks/${taskId}/trigger`;

  try {
    const response = await axios.post(
      url,
      { payload, options },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function getTriggerRun(runId: string, apiKey: string) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v3/runs/${runId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return {
      data: response.data,
      rateLimit: {
        limit: response.headers['x-ratelimit-limit'],
        remaining: response.headers['x-ratelimit-remaining'],
        reset: response.headers['x-ratelimit-reset'],
      },
    };
  } catch (error) {
    return {
      status: 'FAILED',
    };
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollTriggerRun(
  runId: string,
  apiKey: string,
  retryDelay = 1000,
) {
  try {
    const completionStatuses = [
      'COMPLETED',
      'CANCELED',
      'FAILED',
      'CRASHED',
      'INTERRUPTED',
      'SYSTEM_FAILURE',
    ];
    const timeoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutDuration) {
      const { data: run, rateLimit } = await getTriggerRun(runId, apiKey);

      if (completionStatuses.includes(run.status)) {
        return run; // Return run status if completed
      }

      // Extract rate limit info from headers
      const remaining = parseInt(rateLimit.remaining, 10);
      const resetTime = parseInt(rateLimit.reset, 10) * 1000; // Convert to milliseconds

      if (remaining === 0) {
        const delayUntilReset = resetTime - Date.now();
        await wait(delayUntilReset); // Wait until reset if rate limit is reached
      } else {
        // Normal delay between retries
        await wait(retryDelay); // Convert retryDelay to milliseconds
      }
    }
  } catch (e) {
    return {};
  }
}

export async function triggerTaskSync(
  taskId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  apiKey: string,
  options?: Record<string, string>,
) {
  const handle = await triggerTask(taskId, payload, apiKey, options);
  const run = await pollTriggerRun(handle.id, apiKey);
  return run.output;
}
