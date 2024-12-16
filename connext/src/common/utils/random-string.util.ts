import * as crypto from 'crypto';
export const randomeStringGenerator = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');
