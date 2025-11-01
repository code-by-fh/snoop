import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.createHash('sha256').update(process.env.TRACKING_SECRET_KEY || 'mysecret').digest();
const IV_LENGTH = 16;

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return `${iv.toString('base64')}:${encrypted}`;
}

export function decrypt(encryptedText) {
  const [ivBase64, encryptedBase64] = encryptedText.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


export function generateActivationKey() {
  return crypto.randomBytes(32).toString('hex');
}

export function createHashedToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createToken(expiresInHours) {
  const plainToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = createHashedToken(plainToken);

  let expires = null;
  if (expiresInHours) {
    expires = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  }

  return { plainToken, hashedToken, expires };
}