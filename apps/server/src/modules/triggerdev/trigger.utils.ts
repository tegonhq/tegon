/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to parse the logs - This is taken directly from the
// https://github.dev/triggerdotdev/trigger.dev - triggerdotdev/trigger.dev/apps/webapp/app/v3/eventRepository.server.ts,
// triggerdotdev/trigger.dev/apps/webapp/app/routes/resources.runs.$runParam.logs.download.ts
import { Knex as KnexT } from 'knex';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique identifiers

export const NULL_SENTINEL = '$@null((';
import nodeCrypto from 'node:crypto';

import { LoggerService } from 'modules/logger/logger.service';

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

// Trigger functions
// Check if a project exists based on the provided whereClause
export async function createOrg(knex: KnexT, logger: LoggerService) {
  const commonId = process.env.TRIGGER_COMMON_ID;

  try {
    // Check if user already exists
    const existingUser = await knex('User').where({ id: commonId }).first();

    if (existingUser) {
      logger.info({
        message: `Trigger user already exist`,
        where: `TriggerdevService.createOrg`,
      });
      return; // User already exists, no need to proceed
    }

    // Create new entries using a transaction
    await knex.transaction(async (trx) => {
      // Create User
      await trx('User').insert({
        id: commonId,
        admin: true,
        authenticationMethod: 'MAGIC_LINK',
        displayName: 'Harshith',
        email: 'harshith@tegon.ai',
        name: 'Harshith',
        confirmedBasicDetails: true,
        updatedAt: new Date(),
      });

      // Create Organization
      await trx('Organization').insert({
        id: commonId,
        slug: 'tegon',
        title: 'Tegon',
        v3Enabled: true,
        updatedAt: new Date(),
      });

      // Create OrgMember
      await trx('OrgMember').insert({
        id: commonId,
        organizationId: commonId,
        userId: commonId,
        role: 'ADMIN',
        updatedAt: new Date(),
      });
    });
  } catch (error) {
    // Re-throw any errors that occur
    logger.error({
      message: `Error creating org`,
      where: `TriggerdevService.org`,
      error,
    }); // Log an error if project creation fails
  }
}

export async function checkIfProjectExist(
  whereClause: {
    name?: string;
    slug?: string;
    id?: string;
  },
  knex: KnexT,
): Promise<boolean> {
  const project = await getProject(whereClause, knex); // Get the project based on the whereClause
  return !!project; // Return true if a project exists, false otherwise
}

async function getProject(
  whereClause: {
    name?: string;
    slug?: string;
    id?: string;
  },
  knex: KnexT,
) {
  try {
    const response = await knex('Project')
      .where(whereClause) // Filter projects based on the provided whereClause
      .select('id', 'name', 'slug'); // Select the ID, name, and slug columns

    return response[0]; // Return the first project matching the whereClause
  } catch (e) {
    return undefined; // Return undefined if an error occurs
  }
}

// Create personal token taking from the .env
// Used to deploy the tegon backgrounds
export async function createPersonalToken(knex: KnexT) {
  const commonId = process.env.TRIGGER_COMMON_ID;
  const id = uuidv4().replace(/-/g, ''); // Generate a unique ID for the personal access token

  const response = await knex('PersonalAccessToken')
    .where({
      userId: commonId, // Filter by the common project user ID
    })
    .select('id'); // Select the ID column

  if (response.length > 0) {
    return; // Return if a personal access token already exists
  }

  await knex('PersonalAccessToken').insert({
    id, // ID of the personal access token
    name: 'cli', // Name of the personal access token
    userId: commonId, // User ID associated with the personal access token
    updatedAt: new Date(), // Updated timestamp
    obfuscatedToken: process.env.TRIGGER_ACCESS_TOKEN, // Obfuscated token from environment variable
    hashedToken: hashToken(process.env.TRIGGER_ACCESS_TOKEN), // Hashed token using the hashToken utility function
    encryptedToken: encryptToken(process.env.TRIGGER_ACCESS_TOKEN), // Encrypted token using the encryptToken utility function
  });
}

// Create a new project with the given name, slug, and optional secret key
export async function createProject(
  name: string,
  slug: string,
  secretKey: string,
  knex: KnexT,
  logger: LoggerService,
) {
  try {
    const id = uuidv4().replace(/-/g, ''); // Generate a unique ID for the project
    slug = slug.replace(/-/g, ''); // Remove hyphens from the slug
    const secret = secretKey ? secretKey : id; // Use the provided secret key or the project ID as the secret
    const commonId = process.env.TRIGGER_COMMON_ID;

    await knex.transaction(async (trx) => {
      await knex('Project')
        .insert({
          id, // Project ID
          name, // Project name
          organizationId: commonId, // Organization ID (common project ID)
          slug, // Project slug
          externalRef: `proj_${slug}`, // External reference for the project
          version: 'V3', // Project version
          updatedAt: new Date(), // Updated timestamp
        })
        .transacting(trx); // Use the transaction

      await knex('RuntimeEnvironment')
        .insert(
          ['dev', 'prod'].map((env: string) => ({
            id: uuidv4(), // Generate a unique ID for the runtime environment
            slug: env, // Slug for the runtime environment (dev or prod)
            apiKey: `tr_${env}_${secret}`, // API key for the runtime environment
            organizationId: commonId, // Organization ID (common project ID)
            orgMemberId: commonId, // Organization member ID (common project ID)
            projectId: id, // Project ID
            type: env === 'prod' ? 'PRODUCTION' : 'DEVELOPMENT', // Type of the runtime environment (production or development)
            pkApiKey: `tr_pk_${env}${secret}`, // Primary key API key for the runtime environment
            shortcode: env, // Shortcode for the runtime environment (dev or prod)
            updatedAt: new Date(), // Updated timestamp
          })),
        )
        .transacting(trx); // Use the transaction
    });

    return id; // Return the project ID
  } catch (error) {
    logger.error({
      message: `Error creating project`,
      where: `TriggerdevService.createProject`,
      error,
    }); // Log an error if project creation fails

    return undefined; // Return undefined if an error occurs
  }
}

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
