import { wait } from '@trigger.dev/sdk/v3';
import axios from 'axios';

export async function triggerTask(
  taskId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v1/tasks/${taskId}/trigger`;

  try {
    const response = await axios.post(
      url,
      { payload },
      {
        headers: {
          Authorization: `Bearer ${process.env['TRIGGER_INTEGRATION_SECRET_KEY']}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    return {};
  }
}

export async function getTriggerRun(runId: string) {
  const url = `${process.env['TRIGGER_API_URL']}/api/v3/runs/${runId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env['TRIGGER_INTEGRATION_SECRET_KEY']}`,
      },
    });
    return response.data;
  } catch (error) {
    return {};
  }
}

export async function pollTriggerRun(runId: string, retryDelay = 10) {
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
    const run = await getTriggerRun(runId);

    if (completionStatuses.includes(run.status)) {
      return run;
    }

    await wait.for({ seconds: retryDelay });
  }

  throw new Error(
    `Timeout exceeded or maximum retries reached for trigger run ${runId}`,
  );
}
