import crypto from 'crypto';

export const generateUniqueId = (length = 24) => {
  // Generate random bytes and encode them as base64
  return (
    crypto
      .randomBytes(length)
      .toString('base64')
      // Remove non-url-safe characters
      .replace(/\+/g, '0')
      .replace(/\//g, '0')
      .replace(/=/g, '')
  );
};
