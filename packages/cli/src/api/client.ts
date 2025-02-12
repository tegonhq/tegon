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

  // Create resources for the deployed action
  async resourceCreation(config: ConfigMap, version: string) {
    try {
      await axios.post(`${this.apiUrl}/api/v1/action/create-action`, {
        config,
        version,
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

  async uploadActionFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await axios.post(
        `${this.apiUrl}/api/v1/attachment/upload/action`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        log.error(
          `Error uploading files: ${JSON.stringify(error.response?.data)}`,
        );
      } else {
        log.error(`Unexpected error: ${error}`);
      }

      process.exit(1);
    }
  }
}
