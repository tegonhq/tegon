import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActionScheduleStatusEnum } from '@tegonhq/types';
import axios from 'axios';
import Knex, { Knex as KnexT } from 'knex'; // Import Knex for database operations
import { PrismaService } from 'nestjs-prisma';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique identifiers

import { LoggerService } from 'modules/logger/logger.service';

import { formatRunEvent, prepareEvent } from './trigger.utils'; // Import utility functions for formatting run events
import { Env } from './triggerdev.interface';
import {
  cancelRun,
  encryptToken,
  getRun,
  getRuns,
  hashToken,
  replayRun,
  triggerTask,
  triggerTaskSync,
} from './triggerdev.utils'; // Import utility functions for triggering tasks and handling runs

export const TriggerProjects = {
  Common: 'common', // Define a constant for the common project
};

@Injectable()
export class TriggerdevService {
  private readonly logger: LoggerService = new LoggerService('TriggerService'); // Logger instance for logging

  knex: KnexT; // Knex instance for database operations
  commonId: string; // ID of the common project

  constructor(
    private prisma: PrismaService, // Prisma service for database operations
    private configService: ConfigService, // Config service for accessing environment variables
  ) {
    this.knex = Knex({
      client: 'pg', // Use PostgreSQL as the database client
      connection: process.env.TRIGGER_DATABASE_URL, // Database connection URL from environment variable
    });
    this.commonId = process.env.TRIGGER_COMMON_ID; // ID of the common project from environment variable
  }

  afterInit() {
    this.logger.info({
      message: 'Trigger service Module initiated',
      where: `TriggerdevService.afterInit`,
    }); // Log a message after initialization
  }

  // This project is used to run internal background jobs
  async initCommonProject() {
    const commonProjectExists = await this.checkIfProjectExist({
      slug: 'common', // Check if a project with the slug 'common' exists
    });

    this.createPersonalToken(); // Create a personal access token

    if (!commonProjectExists) {
      this.logger.info({
        message: `Common project doesn't exist`,
        where: `TriggerdevService.initCommonProject`,
      }); // Log a message if the common project doesn't exist
      await this.createProject('Common', 'common', uuidv4().replace(/-/g, '')); // Create the common project
    }
  }

  // Create personal token taking from the .env
  // Used to deploy the tegon backgrounds
  async createPersonalToken() {
    const id = uuidv4().replace(/-/g, ''); // Generate a unique ID for the personal access token

    const response = await this.knex('PersonalAccessToken')
      .where({
        userId: this.commonId, // Filter by the common project user ID
      })
      .select('id'); // Select the ID column

    if (response.length > 0) {
      return; // Return if a personal access token already exists
    }

    await this.knex('PersonalAccessToken').insert({
      id, // ID of the personal access token
      name: 'cli', // Name of the personal access token
      userId: this.commonId, // User ID associated with the personal access token
      updatedAt: new Date(), // Updated timestamp
      obfuscatedToken: process.env.TRIGGER_ACCESS_TOKEN, // Obfuscated token from environment variable
      hashedToken: hashToken(process.env.TRIGGER_ACCESS_TOKEN), // Hashed token using the hashToken utility function
      encryptedToken: encryptToken(process.env.TRIGGER_ACCESS_TOKEN), // Encrypted token using the encryptToken utility function
    });
  }

  // Get a project by name, slug, or ID
  async getProject(whereClause: { name?: string; slug?: string; id?: string }) {
    try {
      const response = await this.knex('Project')
        .where(whereClause) // Filter projects based on the provided whereClause
        .select('id', 'name', 'slug'); // Select the ID, name, and slug columns

      return response[0]; // Return the first project matching the whereClause
    } catch (e) {
      return undefined; // Return undefined if an error occurs
    }
  }

  // Get the latest version for a given task slug
  async getLatestVersionForTask(slug: string): Promise<string | undefined> {
    const latestWorker = await this.knex('BackgroundWorkerTask')
      .where('slug', slug) // Filter by the task slug
      .join(
        'BackgroundWorker', // Join with the BackgroundWorker table
        'BackgroundWorkerTask.workerId', // Join condition
        'BackgroundWorker.id',
      )
      .orderBy('BackgroundWorker.updatedAt', 'desc') // Order by the updated timestamp in descending order
      .first('BackgroundWorker.version'); // Select the first row's version column

    return latestWorker?.version; // Return the latest version or undefined if not found
  }

  // Get the production runtime environment for a given project ID
  async getProdRuntimeForProject(projectId: string, slug: string) {
    try {
      const response = await this.knex('RuntimeEnvironment')
        .where({
          projectId, // Filter by the project ID
          slug,
        })
        .select('id', 'slug', 'apiKey'); // Select the ID, slug, and API key columns

      return response[0]; // Return the first runtime environment matching the criteria
    } catch (e) {
      return undefined; // Return undefined if an error occurs
    }
  }

  // Check if a project exists based on the provided whereClause
  async checkIfProjectExist(whereClause: {
    name?: string;
    slug?: string;
    id?: string;
  }): Promise<boolean> {
    const project = await this.getProject(whereClause); // Get the project based on the whereClause
    return !!project; // Return true if a project exists, false otherwise
  }

  // Create a new project with the given name, slug, and optional secret key
  async createProject(name: string, slug: string, secretKey?: string) {
    try {
      const id = uuidv4().replace(/-/g, ''); // Generate a unique ID for the project
      slug = slug.replace(/-/g, ''); // Remove hyphens from the slug
      const secret = secretKey ? secretKey : id; // Use the provided secret key or the project ID as the secret

      await this.knex.transaction(async (trx) => {
        await this.knex('Project')
          .insert({
            id, // Project ID
            name, // Project name
            organizationId: this.commonId, // Organization ID (common project ID)
            slug, // Project slug
            externalRef: `proj_${slug}`, // External reference for the project
            version: 'V3', // Project version
            updatedAt: new Date(), // Updated timestamp
          })
          .transacting(trx); // Use the transaction

        await this.knex('RuntimeEnvironment')
          .insert(
            ['dev', 'prod'].map((env: string) => ({
              id: uuidv4(), // Generate a unique ID for the runtime environment
              slug: env, // Slug for the runtime environment (dev or prod)
              apiKey: `tr_${env}_${secret}`, // API key for the runtime environment
              organizationId: this.commonId, // Organization ID (common project ID)
              orgMemberId: this.commonId, // Organization member ID (common project ID)
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
      this.logger.error({
        message: `Error creating project`,
        where: `TriggerdevService.createProject`,
        error,
      }); // Log an error if project creation fails

      return undefined; // Return undefined if an error occurs
    }
  }

  // Get the production runtime API key for a given project slug
  async getProdRuntimeKey(projectSlug: string, slug: string) {
    const project = await this.getProject({ slug: projectSlug }); // Get the project by slug
    const runtime = await this.getProdRuntimeForProject(project.id, slug); // Get the production runtime environment for the project

    return runtime.apiKey; // Return the API key for the production runtime environment
  }

  // Trigger a task synchronously for a given project slug, task ID, and payload
  async triggerTask(
    projectSlug: string,
    id: string,
    payload: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    env: Env,
    options?: Record<string, string>,
  ) {
    this.logger.info({
      message: 'Triggering task',
      where: `TriggerdevService.triggerTask`,
      payload: { projectSlug, id },
    });

    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const projectslugWithoutHyphen = projectSlug.replace(/-/g, ''); // Remove hyphens from the project slug
    const apiKey = await this.getProdRuntimeKey(
      projectslugWithoutHyphen,
      runtimeSlug,
    ); // Get the production runtime API key
    const response = await triggerTaskSync(id, payload, apiKey, options); // Trigger the task synchronously

    return response; // Return the response from the triggered task
  }

  // Trigger a task asynchronously for a given project slug, task ID, payload, and options
  async triggerTaskAsync(
    projectSlug: string,
    id: string,
    payload: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    env: Env,
    options?: Record<string, string>,
  ) {
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const projectslugWithoutHyphen = projectSlug.replace(/-/g, ''); // Remove hyphens from the project slug

    const apiKey = await this.getProdRuntimeKey(
      projectslugWithoutHyphen,
      runtimeSlug,
    ); // Get the production runtime API key
    const response = await triggerTask(id, payload, apiKey, options); // Trigger the task asynchronously

    return response; // Return the response from the triggered task
  }

  // Get the required keys (trigger key) for a given workspace ID and user ID
  async getRequiredKeys(workspaceId: string, userId: string) {
    const usersOnWorkspace = await this.prisma.usersOnWorkspaces.findFirst({
      where: {
        workspaceId, // Filter by the workspace ID
        userId, // Filter by the user ID
      },
      include: {
        workspace: true, // Include the workspace data
      },
    });

    if (usersOnWorkspace) {
      const projectExist = await this.checkIfProjectExist({
        slug: usersOnWorkspace.workspace.id.replace(/-/g, ''), // Check if a project exists for the workspace
      });

      if (!projectExist) {
        await this.createProject(
          usersOnWorkspace.workspace.name, // Project name
          usersOnWorkspace.workspace.id, // Project slug
          uuidv4().replace(/-/g, ''), // Generate a secret key
        );
      }

      const token = this.configService.get('TRIGGER_ACCESS_TOKEN'); // Get the trigger access token from the config service
      return { triggerKey: token }; // Return the trigger key
    }

    return undefined; // Return undefined if the user is not on the workspace
  }

  getRuntimeSlugForProject(projectSlug: string, env: Env = Env.PROD) {
    if (projectSlug === 'common') {
      return this.configService.get('NODE_ENV') === 'production'
        ? Env.PROD
        : Env.DEV;
    }

    return env;
  }

  // Get runs for a given project slug and task ID
  async getRunsForTask(projectSlug: string, taskId: string, env: Env) {
    const projectslugWithoutHyphen = projectSlug.replace(/-/g, ''); // Remove hyphens from the project slug

    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const apiKey = await this.getProdRuntimeKey(
      projectslugWithoutHyphen,
      runtimeSlug,
    ); // Get the production runtime API key

    return await getRuns(taskId, apiKey); // Get the runs for the task
  }

  // Get a run for a given project slug and run ID
  async getRun(projectSlug: string, runId: string, env: Env) {
    const projectslugWithoutHyphen = projectSlug.replace(/-/g, ''); // Remove hyphens from the project slug
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const apiKey = await this.getProdRuntimeKey(
      projectslugWithoutHyphen,
      runtimeSlug,
    ); // Get the production runtime API key
    const run = await getRun(runId, apiKey); // Get the run data
    const logs = await this.getLogsForRunId(runId); // Get the logs for the run

    return { ...run, logs }; // Return the run data with logs
  }

  // Replay a run for a given project slug and run ID
  async replayRun(projectSlug: string, runId: string, env: Env) {
    const projectslugWithoutHyphen = projectSlug.replace(/-/g, ''); // Remove hyphens from the project slug
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const apiKey = await this.getProdRuntimeKey(
      projectslugWithoutHyphen,
      runtimeSlug,
    ); // Get the production runtime API key

    return await replayRun(runId, apiKey);
  }

  async cancelRun(projectSlug: string, runId: string, env: Env) {
    const projectslugWithoutHyphen = projectSlug.replace(/-/g, ''); // Remove hyphens from the project slug
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const apiKey = await this.getProdRuntimeKey(
      projectslugWithoutHyphen,
      runtimeSlug,
    ); // Get the production runtime API key
    return await cancelRun(runId, apiKey);
  }

  // Get logs for a given run ID
  async getLogsForRunId(runId: string): Promise<string> {
    // Fetch run events from the database using Knex
    const runEvents = await this.knex('TaskEvent')
      .where('runId', runId) // Filter by the run ID
      .orderBy('startTime', 'asc'); // Order by the start time in ascending order

    const preparedEvents = [];

    for (const event of runEvents) {
      preparedEvents.push(prepareEvent(event)); // Prepare the event data
    }

    // Format the run events into a log string
    const logEntries = preparedEvents.map(formatRunEvent); // Format the prepared events
    const logString = logEntries.join('\n'); // Join the log entries with newlines

    return logString; // Return the log string
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createScheduleTask(payload: any, env: Env) {
    const projectSlug = 'common'; // Specify the project slug
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env); // Get the runtime slug for the project and environment

    const apiKey = await this.getProdRuntimeKey(projectSlug, runtimeSlug); // Get the production runtime API key

    const url = `${process.env['TRIGGER_API_URL']}/api/v1/schedules`; // Construct the API URL for creating a schedule task

    try {
      const response = await axios.post(
        // Send a POST request to create the schedule task
        url,
        { task: 'schedule-proxy', ...payload }, // Include the task type and payload data
        { headers: { Authorization: `Bearer ${apiKey}` } }, // Include the API key in the headers
      );

      return response.data; // Return the response data from the POST request
    } catch (error) {
      this.logger.error({
        // Log the error if the create schedule task operation fails
        message: 'Failed to create schedule task',
        where: 'TriggerDevService.CreateScheduleTask',
        error,
      });
      throw new InternalServerErrorException(`Failed to create schedule task`); // Throw an InternalServerErrorException
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateScheduleTask(actionScheduleId: string, payload: any, env: Env) {
    const projectSlug = 'common'; // Specify the project slug
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env); // Get the runtime slug for the project and environment

    const apiKey = await this.getProdRuntimeKey(projectSlug, runtimeSlug); // Get the production runtime API key

    try {
      const { status, ...otherPayload } = payload; // Destructure the payload to separate the status
      let url = `${process.env['TRIGGER_API_URL']}/api/v1/schedules/${actionScheduleId}`; // Construct the API URL for updating the schedule task
      const response = await axios.put(
        // Send a PUT request to update the schedule task
        url,
        { task: 'schedule-proxy', ...otherPayload }, // Include the task type and other payload data
        { headers: { Authorization: `Bearer ${apiKey}` } }, // Include the API key in the headers
      );

      // Construct the URL for activating or deactivating the schedule task based on the status
      url =
        status === ActionScheduleStatusEnum.ACTIVE
          ? `${url}/activate`
          : `${url}/deactivate`;

      await axios.post(
        // Send a POST request to activate or deactivate the schedule task
        url,
        {},
        { headers: { Authorization: `Bearer ${apiKey}` } }, // Include the API key in the headers
      );

      return response.data; // Return the response data from the initial PUT request
    } catch (error) {
      this.logger.error({
        // Log the error if the update schedule task operation fails
        message: 'Failed to update schedule task',
        where: 'TriggerDevService.CreateScheduleTask',
        error,
      });
      throw new InternalServerErrorException(`Failed to update schedule task`); // Throw an InternalServerErrorException
    }
  }

  async deleteScheduleTask(actionScheduleId: string, env: Env) {
    const projectSlug = 'common';
    const runtimeSlug = this.getRuntimeSlugForProject(projectSlug, env);

    const apiKey = await this.getProdRuntimeKey(projectSlug, runtimeSlug); // Get the production runtime API key

    const url = `${process.env['TRIGGER_API_URL']}/api/v1/schedules/${actionScheduleId}`;

    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      return response.data;
    } catch (error) {
      this.logger.error({
        message: 'Failed to delete schedule task',
        where: 'TriggerDevService.CreateScheduleTask',
        error,
      });
      throw new InternalServerErrorException(`Failed to delete schedule task`); // Throw InternalServerErrorException
    }
  }
}
