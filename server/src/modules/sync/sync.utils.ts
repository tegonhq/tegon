/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as cookie from 'cookie';

import { hasValidHeader } from 'common/authentication';

export async function isValidAuthentication(
  headers: Record<string, string | string[]>,
) {
  if (!headers.cookie) {
    return false;
  }

  const cookies = cookie.parse(headers.cookie as string);

  if (!cookies) {
    return false;
  }
  if (!cookies.sAccessToken) {
    return false;
  }

  return await hasValidHeader(`Bearer ${cookies.sAccessToken}`, false);
}
