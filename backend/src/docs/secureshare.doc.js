// backend/src/docs/secureShare.docs.js

/**
 * @swagger
 * tags:
 * name: Secure Share
 * description: Securely share a password from your vault with another registered user.
 */

/**
 * @swagger
 * components:
 * schemas:
 * CreateShareRequest:
 * type: object
 * required:
 * - recipientEmail
 * - passwordItem
 * properties:
 * recipientEmail:
 * type: string
 * format: email
 * description: The email address of the registered user to share the password with.
 * example: "recipient@example.com"
 * passwordItem:
 * $ref: '#/components/schemas/PasswordItem'
 * expiresIn:
 * type: string
 * description: "How long the share link should be valid (e.g., '1h', '1d'). Defaults to 24 hours."
 * example: "2h"
 *
 * CreateShareResponse:
 * type: object
 * properties:
 * accessToken:
 * type: string
 * description: A unique token representing the share link. The full link is /claim-share/{accessToken}.
 * example: "shr_..._..."
 *
 * ClaimShareResponse:
 * type: object
 * properties:
 * passwordItem:
 * $ref: '#/components/schemas/PasswordItem'
 */

/**
 * @swagger
 * /secure-share:
 * post:
 * summary: Create a secure, one-time link to share a password
 * tags: [Secure Share]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateShareRequest'
 * responses:
 * '201':
 * description: Share link created successfully. The link is valid for a limited time.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * $ref: '#/components/schemas/CreateShareResponse'
 * '404':
 * description: Recipient user not found.
 */

/**
 * @swagger
 * /secure-share/claim/{accessToken}:
 * post:
 * summary: Claim a shared password using an access token
 * description: The recipient user must be logged in to claim the share. The share is deleted after being claimed.
 * tags: [Secure Share]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: accessToken
 * required: true
 * schema:
 * type: string
 * description: The token from the share link.
 * responses:
 * '200':
 * description: Password claimed successfully. The item can now be added to the recipient's vault.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * $ref: '#/components/schemas/ClaimShareResponse'
 * '404':
 * description: Share not found or expired.
 */