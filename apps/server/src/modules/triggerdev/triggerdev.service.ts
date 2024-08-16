import { Injectable, Logger } from '@nestjs/common';
import Knex, { Knex as KnexT } from 'knex';
import { v4 as uuidv4 } from 'uuid';

import {
  encryptToken,
  hashToken,
  triggerTask,
  triggerTaskSync,
} from './triggerdev.utils';

export const TriggerProjects = {
  Common: 'common',
};

@Injectable()
export class TriggerdevService {
  private readonly logger: Logger = new Logger('TriggerService');

  knex: KnexT;
  commonId: string;

  constructor() {
    this.knex = Knex({
      client: 'pg',
      connection: process.env.TRIGGER_DATABASE_URL,
    });
    this.commonId = process.env.TRIGGER_COMMON_ID;
  }

  afterInit() {
    this.logger.log('Trigger service Module initiated');
  }

  // This project is used to run internal backgrounds jobs
  async initCommonProject() {
    const commonProjectExists = await this.checkIfProjectExist({
      slug: 'common',
    });

    this.createPersonalToken();

    if (!commonProjectExists) {
      this.logger.log(`Common project doesn't exist`);
      await this.createProject('Common', 'common', uuidv4().replace(/-/g, ''));
    }
  }

  // Create personal token taking from the .env
  // Used to deloy the tegon backgrounds
  async createPersonalToken() {
    const id = uuidv4().replace(/-/g, '');

    const response = await this.knex('PersonalAccessToken')
      .where({
        userId: this.commonId,
      })
      .select('id');

    if (response.length > 0) {
      return;
    }

    await this.knex('PersonalAccessToken').insert({
      id,
      name: 'cli',
      userId: this.commonId,
      updatedAt: new Date(),
      obfuscatedToken: process.env.TRIGGER_ACCESS_TOKEN,
      hashedToken: hashToken(process.env.TRIGGER_ACCESS_TOKEN),
      encryptedToken: encryptToken(process.env.TRIGGER_ACCESS_TOKEN),
    });
  }

  async getProject(whereClause: { name?: string; slug?: string; id?: string }) {
    try {
      const response = await this.knex('Project')
        .where(whereClause)
        .select('id', 'name', 'slug');

      return response[0];
    } catch (e) {
      return undefined;
    }
  }

  async getProdRuntimeForProject(projectId: string) {
    try {
      const response = await this.knex('RuntimeEnvironment')
        .where({
          projectId,
          slug: 'dev',
        })
        .select('id', 'slug', 'apiKey');

      return response[0];
    } catch (e) {
      return undefined;
    }
  }

  async checkIfProjectExist(whereClause: {
    name?: string;
    slug?: string;
    id?: string;
  }): Promise<boolean> {
    const project = await this.getProject(whereClause);
    return !!project;
  }

  async createProject(name: string, slug: string, secretKey?: string) {
    try {
      const id = uuidv4().replace(/-/g, '');
      const secret = secretKey ? secretKey : id;
      await this.knex.transaction(async (trx) => {
        await this.knex('Project')
          .insert({
            id,
            name,
            organizationId: this.commonId,
            slug,
            externalRef: `proj_${slug}`,
            version: 'V3',
            updatedAt: new Date(),
          })
          .transacting(trx);

        await this.knex('RuntimeEnvironment')
          .insert(
            ['dev', 'prod'].map((env: string) => ({
              id: uuidv4(),
              slug: env,
              apiKey: `tr_${env}_${secret}`,
              organizationId: this.commonId,
              orgMemberId: this.commonId,
              projectId: id,
              type: env === 'prod' ? 'PRODUCTION' : 'DEVELOPMENT',
              pkApiKey: `tr_pk_${env}${secret}`,
              shortcode: env,
              updatedAt: new Date(),
            })),
          )
          .transacting(trx);
      });

      return id;
    } catch (e) {
      this.logger.log(`Error creating project: ${e}`);

      return undefined;
    }
  }

  async getProdRuntimeKey(projectSlug: string) {
    const project = await this.getProject({ slug: projectSlug });
    const runtime = await this.getProdRuntimeForProject(project.id);

    return runtime.apiKey;
  }

  async triggerTask(
    projectSlug: string,
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
  ) {
    const projectslugWithoutHyphen = projectSlug.replace(/-/g, '');
    const apiKey = await this.getProdRuntimeKey(projectslugWithoutHyphen);
    const response = await triggerTaskSync(id, payload, apiKey);

    return response;
  }

  async triggerTaskAsync(
    projectSlug: string,
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
  ) {
    const projectslugWithoutHyphen = projectSlug.replace(/-/g, '');

    const apiKey = await this.getProdRuntimeKey(projectslugWithoutHyphen);
    const response = await triggerTask(id, payload, apiKey);

    return response;
  }

  async getRequiredKeys(workspaceId: string) {
    const projectslugWithoutHyphen = workspaceId.replace(/-/g, '');
    const apiKey = await this.getProdRuntimeKey(projectslugWithoutHyphen);

    return { triggerKey: apiKey };
  }
}
