/**
 * @swagger
 * tags:
 *   name: Password Vault
 *   description: A secure, encrypted vault for storing and managing user passwords. Includes a tool to check for password breaches. All endpoints require authentication.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A unique client-side generated ID for the password entry.
 *           example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *         name:
 *           type: string
 *           description: The name of the service or website.
 *           example: "GitHub"
 *         username:
 *           type: string
 *           description: The username or email associated with the account.
 *           example: "shivam072001"
 *         password:
 *           type: string
 *           description: The stored password.
 *           example: "super_secret_password_123"
 *     Vault:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the vault record.
 *           example: "60d0fe4f5311236168a109df"
 *         user:
 *           type: string
 *           description: The ID of the user who owns the vault.
 *           example: "60d0fe4f5311236168a109ca"
 *         vaultData:
 *           type: string
 *           description: The encrypted vault data as a string. The client is responsible for decryption.
 *           example: "U2FsdGVkX1+..."
 *     SaveVaultRequest:
 *       type: object
 *       required:
 *         - vaultData
 *       properties:
 *         vaultData:
 *           type: string
 *           description: The entire vault content, encrypted on the client-side, and sent as a single string.
 *           example: "U2FsdGVkX1/v3x+..."
 *     CheckBreachRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: The password to check against the Pwned Passwords database.
 *           example: "password123"
 *     CheckBreachResponse:
 *       type: object
 *       properties:
 *         breachCount:
 *           type: integer
 *           description: The number of times this password has appeared in data breaches. A count of 0 is good.
 *           example: 3678910
 *         isPwned:
 *           type: boolean
 *           description: A simple boolean indicating if the password has been breached.
 *           example: true
 */

/**
 * @swagger
 * /vault:
 *   get:
 *     summary: Retrieve the user's encrypted password vault
 *     tags: [Password Vault]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The user's encrypted vault data. If the user has no vault, the `vaultData` will be null.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Vault'
 *       '401':
 *         description: Unauthorized.
 *   post:
 *     summary: Save or update the user's encrypted password vault
 *     tags: [Password Vault]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveVaultRequest'
 *     responses:
 *       '200':
 *         description: Vault saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vault saved successfully."
 *       '400':
 *         description: Bad request (e.g., missing vaultData).
 */

/**
 * @swagger
 * /vault/check-breach:
 *   post:
 *     summary: Check if a password has been exposed in a data breach
 *     tags: [Password Vault]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckBreachRequest'
 *     responses:
 *       '200':
 *         description: The result of the breach check.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CheckBreachResponse'
 *       '400':
 *         description: Bad request (e.g., missing password).
 */