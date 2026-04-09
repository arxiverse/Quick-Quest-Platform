const { argon2Sync, randomBytes, timingSafeEqual } = require('node:crypto');

const HASH_VERSION = 'v1';
const HASH_PREFIX = `argon2id:${HASH_VERSION}`;
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

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

function createAccessToken() {
  return randomBytes(48).toString('hex');
}

function getGoGatewayUrl() {
  return process.env.GO_API_URL || 'http://localhost:4460';
}

module.exports = {
  SESSION_DURATION_MS,
  createAccessToken,
  getGoGatewayUrl,
  hashPassword,
  verifyPassword,
};
