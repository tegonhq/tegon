import nodeCrypto from 'node:crypto';

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
