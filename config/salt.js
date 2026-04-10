const { argon2Sync, createHash, randomBytes, randomUUID, timingSafeEqual } = require('node:crypto');

const HASH_VERSION = 'v1';
const HASH_PREFIX = `argon2id:${HASH_VERSION}`;
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'qqm-local-dev-secret';

function deriveArgon2(password, salt) {
  return Buffer.from(
    argon2Sync('argon2id', {
      message: password,
      nonce: salt,
      parallelism: 4,
      tagLength: 32,
      memory: 65536,
      passes: 3,
    })
  );
}

function generateUuidV4() {
  return randomUUID();
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = deriveArgon2(password, salt);
  return `${HASH_PREFIX}:${salt.toString('base64url')}:${hash.toString('base64url')}`;
}

function verifyPassword(password, encodedHash) {
  if (typeof encodedHash !== 'string') {
    return false;
  }

  const [algorithm, version, saltBase64, hashBase64] = encodedHash.split(':');
  if (algorithm !== 'argon2id' || version !== HASH_VERSION || !saltBase64 || !hashBase64) {
    return false;
  }

  const salt = Buffer.from(saltBase64, 'base64url');
  const expectedHash = Buffer.from(hashBase64, 'base64url');
  const actualHash = deriveArgon2(password, salt);

  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
}

function createAuthToken(identityPayload) {
  const issuedAt = Date.now().toString();
  const entropy = randomBytes(24).toString('hex');
  const serializedIdentity = JSON.stringify({
    id: identityPayload.id,
    username: identityPayload.username,
    email: identityPayload.email,
    phone: identityPayload.phone,
  });

  return createHash('sha256')
    .update(serializedIdentity)
    .update(issuedAt)
    .update(entropy)
    .update(AUTH_TOKEN_SECRET)
    .digest('hex');
}

module.exports = {
  SESSION_DURATION_MS,
  createAuthToken,
  generateUuidV4,
  hashPassword,
  verifyPassword,
};
