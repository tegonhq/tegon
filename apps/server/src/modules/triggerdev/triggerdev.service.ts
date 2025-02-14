import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ActionScheduleStatusEnum } from '@tegonhq/types';
import axios from 'axios';
import Knex, { Knex as KnexT } from 'knex';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique identifiers

import { LoggerService } from 'modules/logger/logger.service';

import {
  checkIfProjectExist,
  createOrg,
  createPersonalToken,
  createProject,
} from './trigger.utils';

export const TriggerProjects = {
  Common: 'common', // Define a constant for the common project
};

@Injectable()
export class TriggerdevService {
  private readonly logger: LoggerService = new LoggerService('TriggerService'); // Logger instance for logging
  knex: KnexT; // Knex instance for database operations

  constructor() {
    this.knex = Knex({
      client: 'pg', // Use PostgreSQL as the database client
      connection: process.env.TRIGGER_DATABASE_URL, // Database connection URL from environment variable
    });
  }

  afterInit() {
    this.logger.info({
      message: 'Trigger service Module initiated',
      where: `TriggerdevService.afterInit`,
    }); // Log a message after initialization
  }

  async initCommonProject() {
    await createOrg(this.knex, this.logger);

    const commonProjectExists = await checkIfProjectExist(
      {
        slug: 'common', // Check if a project with the slug 'common' exists
      },
      this.knex,
    );

    createPersonalToken(this.knex); // Create a personal access token

    if (!commonProjectExists) {
      this.logger.info({
        message: `Common project doesn't exist`,
        where: `TriggerdevService.initCommonProject`,
      }); // Log a message if the common project doesn't exist
      await createProject(
        'Common',
        'common',
        uuidv4().replace(/-/g, ''),
        this.knex,
        this.logger,
      ); // Create the common project
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createScheduleTask(payload: any) {
    const url = `${process.env['TRIGGER_API_URL']}/api/v1/schedules`; // Construct the API URL for creating a schedule task

    try {
      const response = await axios.post(
        // Send a POST request to create the schedule task
        url,
        { task: 'schedule-proxy', ...payload }, // Include the task type and payload data
        {
          headers: {
            Authorization: `Bearer ${process.env.TRIGGER_ACCESS_TOKEN}`,
          },
        }, // Include the API key in the headers
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

  async updateScheduleTask(
    actionScheduleId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
  ) {
    try {
      const { status, ...otherPayload } = payload; // Destructure the payload to separate the status
      let url = `${process.env['TRIGGER_API_URL']}/api/v1/schedules/${actionScheduleId}`; // Construct the API URL for updating the schedule task
      const response = await axios.put(
        // Send a PUT request to update the schedule task
        url,
        { task: 'schedule-proxy', ...otherPayload }, // Include the task type and other payload data
        {
          headers: {
            Authorization: `Bearer ${process.env.TRIGGER_ACCESS_TOKEN}`,
          },
        }, // Include the API key in the headers
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
        {
          headers: {
            Authorization: `Bearer ${process.env.TRIGGER_ACCESS_TOKEN}`,
          },
        }, // Include the API key in the headers
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

  async deleteScheduleTask(actionScheduleId: string) {
    const url = `${process.env['TRIGGER_API_URL']}/api/v1/schedules/${actionScheduleId}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${process.env.TRIGGER_ACCESS_TOKEN}`,
        },
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
