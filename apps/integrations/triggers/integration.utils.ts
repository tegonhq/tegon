import { PostRequestBody, RequestHeaders } from '@tegonhq/types';
import { AbortTaskRunError, logger } from '@trigger.dev/sdk/v3';
import axios from 'axios';

export async function getRequest(url: string, headers: RequestHeaders) {
  try {
    const response = await axios.get(url, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    logger.error(`Error making Get request to ${url}: ${error}`);
    throw new AbortTaskRunError(
      `Get request failed to ${url} ${error.response}`,
    );
  }
}

export async function postRequest(
  url: string,
  headers: RequestHeaders,
  body: PostRequestBody,
) {
  try {
    const response = await axios.post(url, body, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    logger.error(`Error making POST request to ${url}: ${error}`);
    throw new AbortTaskRunError(
      `Post request failed to ${url} ${error.response}`,
    );
  }
}

export async function deleteRequest(url: string, headers: RequestHeaders) {
  try {
    const response = await axios.delete(url, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    logger.error(`Error making DELETE request to ${url}: ${error.message}`);
    throw new AbortTaskRunError(
      `Delete request failed to ${url} ${error.response}`,
    );
  }
}
