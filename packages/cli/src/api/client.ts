import { log } from '@clack/prompts';
import axios from 'axios';

export interface ConfigMap {
  path: string;
  config: any;
}

export class ApiClient {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async createAuthorizationCode() {
    const response = await axios.get(
      `${this.apiUrl}/api/v1/users/authorization`,
    );

    const code = response.data.code;

    return {
      url: `${this.apiUrl}/authorize?code=${code}`,
      code,
    };
  }

  async getPersonalAccessToken(code: string) {
    const response = await axios.post(
      `${this.apiUrl}/api/v1/users/pat-for-code`,
      {
        code,
      },
    );

    const token = response.data.token;
    const workspaceId = response.data.workspaceId;

    return {
      token,
      workspaceId,
    };
  }

  async getTriggerAccessToken(workspaceId: string): Promise<string> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v1/triggerdev`, {
        params: { workspaceId },
      });
      return response.data.triggerKey;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        log.error(
          `The token you passed is invalid create a personal token in the app: ${error}`,
        );
      } else {
        log.error(`Unexpected error: ${error}`);
      }
      process.exit(1);
    }
  }

  // Create resources for the deployed action
  async resourceCreation(
    config: ConfigMap,
    workspaceId: string,
    version: string,
    isDev: boolean = false,
  ) {
    try {
      await axios.post(`${this.apiUrl}/api/v1/action/create-action`, {
        workspaceId,
        config,
        version,
        isDev,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        log.error(
          `Error creating resources: ${JSON.stringify(error.response?.data)}`,
        );
      } else {
        log.error(`Unexpected error: ${error}`);
      }
    }
  }

  async cleanResources(config: ConfigMap, workspaceId: string) {
    try {
      await axios.post(`${this.apiUrl}/api/v1/action/clean-dev-action`, {
        workspaceId,
        config,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        log.error(
          `Error cleaning resources: ${JSON.stringify(error.response?.data)}`,
        );
      } else {
        log.error(`Unexpected error: ${error}`);
      }

      process.exit(1);
    }
  }
}
