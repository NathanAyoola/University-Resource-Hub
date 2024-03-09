import crypto from 'crypto';

export default () => {
  // Generate a random buffer of 32 bytes
  const buffer = crypto.randomBytes(16);

  // Convert the buffer to a hexadecimal string
  const token = buffer.toString('hex');

  return token;
};