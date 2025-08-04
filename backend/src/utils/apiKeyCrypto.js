// backend/src/utils/apiKeyCrypto.js

import crypto from 'crypto';
import {
    config
} from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const SCRYPT_PARAMS = {
    N: 16384,
    r: 8,
    p: 1
};

const secret = config.jwtSecret; // Reusing a secret, in production use a dedicated one

const getKey = (salt) => {
    return crypto.scryptSync(secret, salt, KEY_LENGTH, SCRYPT_PARAMS);
};

export const encryptApiKey = (text) => {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getKey(salt);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
};

export const decryptApiKey = (encryptedHex) => {
    try {
        const data = Buffer.from(encryptedHex, 'hex');
        const salt = data.slice(0, SALT_LENGTH);
        const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = data.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const encrypted = data.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const key = getKey(salt);
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return null;
    }
};