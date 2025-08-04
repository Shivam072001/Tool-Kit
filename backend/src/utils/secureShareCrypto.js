import crypto from "crypto";
import { CRYPTO_DEFAULTS } from "../constants/index.js";
import { config } from "../config/env.js";
import { logger } from "./Logger.js";

const {
    ALGORITHM,
    IV_LENGTH,
    SALT_LENGTH,
    TAG_LENGTH,
    KEY_LENGTH,
    ITERATIONS,
    HASH
} = CRYPTO_DEFAULTS;

const { secureShareSecret } = config;

if (!secureShareSecret) {
    throw new Error(
        "SECURE_SHARE_SECRET is not defined in environment variables."
    );
}

/**
 * Encrypts a piece of data using a password (access token).
 * @param {string} data The data to encrypt (will be JSON stringified).
 * @param {string} password The access token used as the password.
 * @returns {string} The encrypted string, including salt, iv, and tag.
 */
export const encrypt = (data, password) => {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.pbkdf2Sync(
        password,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        HASH
    );

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(data), "utf8"),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
};

/**
 * Decrypts a piece of data using a password (access token).
 * @param {string} encryptedHex The encrypted hex string.
 * @param {string} password The access token used as the password.
 * @returns {object|null} The decrypted data object, or null if decryption fails.
 */
export const decrypt = (encryptedHex, password) => {
    try {
        const encryptedData = Buffer.from(encryptedHex, "hex");

        const salt = encryptedData.slice(0, SALT_LENGTH);
        const iv = encryptedData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = encryptedData.slice(
            SALT_LENGTH + IV_LENGTH,
            SALT_LENGTH + IV_LENGTH + TAG_LENGTH
        );
        const encrypted = encryptedData.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

        const key = crypto.pbkdf2Sync(
            password,
            salt,
            ITERATIONS,
            KEY_LENGTH,
            "sha512"
        );

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        const decrypted =
            decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

        return JSON.parse(decrypted);
    } catch (error) {
        logger.error("Decryption failed:", error);
        return null;
    }
};
