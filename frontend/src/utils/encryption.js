// src/utils/encryption.js

import CryptoJS from 'crypto-js';

// The hardcoded SALT is no longer used here.

/**
 * Derives a key from a master password using PBKDF2.
 * @param {string} masterPassword - The user's master password.
 * @param {string} salt - The user's unique salt from the backend.
 * @returns {string} The derived key.
 */
const deriveKey = (masterPassword, salt) => {
    return CryptoJS.PBKDF2(masterPassword, salt, {
        keySize: 256 / 32,
        iterations: 1000,
    }).toString();
};

/**
 * Encrypts data with the master password.
 * @param {object} data - The JSON object to encrypt.
 * @param {string} masterPassword - The user's master password.
 * @param {string} salt - The user's unique salt.
 * @returns {string} The AES-encrypted ciphertext.
 */
export const encryptVault = (data, masterPassword, salt) => {
    const key = deriveKey(masterPassword, salt);
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, key).toString();
};

/**
 * Decrypts data with the master password.
 * @param {string} ciphertext - The AES-encrypted ciphertext.
 * @param {string} masterPassword - The user's master password.
 * @param {string} salt - The user's unique salt.
 * @returns {object|null} The decrypted JSON object or null if decryption fails.
 */
export const decryptVault = (ciphertext, masterPassword, salt) => {
    try {
        const key = deriveKey(masterPassword, salt);
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
            return null;
        }

        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};