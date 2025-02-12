/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to parse the logs - This is taken directly from the
// https://github.dev/triggerdotdev/trigger.dev - triggerdotdev/trigger.dev/apps/webapp/app/v3/eventRepository.server.ts,
// triggerdotdev/trigger.dev/apps/webapp/app/routes/resources.runs.$runParam.logs.download.ts

export const NULL_SENTINEL = '$@null((';

function rehydrateNull(value: any): any {
  if (value === NULL_SENTINEL) {
    return null;
  }

  return value;
}

export function unflattenAttributes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
): Record<string, unknown> | string | number | boolean | null | undefined {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }

  if (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).length === 1 &&
    Object.keys(obj)[0] === ''
  ) {
    return rehydrateNull(obj['']) as any;
  }

  if (Object.keys(obj).length === 0) {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split('.').reduce((acc, part) => {
      if (part.includes('[')) {
        // Handling nested array indices
        const subparts = part.split(/\[|\]/).filter((p) => p !== '');
        acc.push(...subparts);
      } else {
        acc.push(part);
      }
      return acc;
    }, [] as string[]);

    let current: any = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      const isArray = /^\d+$/.test(nextPart);
      if (isArray && !Array.isArray(current[part])) {
        current[part] = [];
      } else if (!isArray && current[part] === undefined) {
        current[part] = {};
      }
      current = current[part];
    }
    const lastPart = parts[parts.length - 1];
    current[lastPart] = rehydrateNull(value);
  }

  // Convert the result to an array if all top-level keys are numeric indices
  if (Object.keys(result).every((k) => /^\d+$/.test(k))) {
    const maxIndex = Math.max(...Object.keys(result).map((k) => parseInt(k)));
    const arrayResult = Array(maxIndex + 1);
    for (const key in result) {
      arrayResult[parseInt(key)] = result[key];
    }
    return arrayResult as any;
  }

  return result;
}

export function prepareEvent(event: any) {
  return {
    ...event,
    duration: Number(event.duration),
    events: parseEventsField(event.events),
    style: parseStyleField(event.style),
  };
}

function parseEventsField(events: any) {
  const unsafe = events
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (events as unknown[]).map((e: any) => ({
        ...e,
        properties: unflattenAttributes(e.properties),
      }))
    : undefined;

  return unsafe;
}

function parseStyleField(style: any) {
  const unsafe = unflattenAttributes(style);

  if (!unsafe) {
    return {};
  }

  if (typeof unsafe === 'object') {
    return {
      icon: undefined,
      variant: undefined,
      ...unsafe,
    };
  }

  return {};
}

export function getDateFromNanoseconds(nanoseconds: bigint) {
  const time = Number(nanoseconds) / 1_000_000;
  return new Date(time);
}

export function formatRunEvent(event: any): string {
  const entries = [];
  const parts: string[] = [];

  parts.push(getDateFromNanoseconds(event.startTime).toISOString());

  if (event.task_slug) {
    parts.push(event.task_slug);
  }

  parts.push(event.level);
  parts.push(event.message);

  if (event.level === 'TRACE') {
    parts.push(`(${getDateFromNanoseconds(event.duration)})`);
  }

  entries.push(parts.join(' '));

  if (event.events) {
    for (const subEvent of event.events) {
      if (subEvent.name === 'exception') {
        const subEventParts: string[] = [];

        subEventParts.push(new Date(subEvent.time).toISOString());

        if (event.task_slug) {
          subEventParts.push(event.task_slug);
        }

        subEventParts.push(subEvent.name);
        subEventParts.push(subEvent.properties.exception.message);

        if (subEvent.properties.exception.stack) {
          subEventParts.push(subEvent.properties.exception.stack);
        }

        entries.push(subEventParts.join(' '));
      }
    }
  }

  return entries.join('\n');
}
