import axios from 'axios';
import { PostRequestBody, RequestHeaders } from './integrations.interface';

export async function getRequest(url: string, headers: RequestHeaders) {
  try {
    const response = await axios.get(url, headers);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
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
    console.error(`Error making POST request to ${url}: ${error.message}`);
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
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
    console.error(`Error making DELETE request to ${url}: ${error.message}`);
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}
