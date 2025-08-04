/**
 * @swagger
 * tags:
 * name: Temporary Email
 * description: Generate a temporary, disposable email address to receive emails.
 */

/**
 * @swagger
 * components:
 * schemas:
 * Message:
 * type: object
 * properties:
 * from:
 * type: string
 * example: "sender@example.com"
 * subject:
 * type: string
 * example: "Welcome to our service!"
 * body:
 * type: string
 * example: "This is the body of the email."
 * receivedAt:
 * type: string
 * format: date-time
 *
 * TemporaryEmail:
 * type: object
 * properties:
 * id:
 * type: string
 * example: "60d0fe4f5311236168a109e9"
 * user:
 * type: string
 * example: "60d0fe4f5311236168a109ca"
 * emailAddress:
 * type: string
 * format: email
 * example: "temp-user123@toolkit.email"
 * inbox:
 * type: array
 * items:
 * $ref: '#/components/schemas/Message'
 * isForwarding:
 * type: boolean
 * description: Indicates if emails are being forwarded to the user's real email.
 * example: false
 *
 * ForwardingSettingsRequest:
 * type: object
 * properties:
 * isForwarding:
 * type: boolean
 * description: Set to true to enable forwarding, false to disable.
 * example: true
 */

/**
 * @swagger
 * /temp-email/generate:
 * post:
 * summary: Generate a new temporary email address
 * description: Each user can only have one temporary email address at a time.
 * tags: [Temporary Email]
 * security:
 * - bearerAuth: []
 * responses:
 * '201':
 * description: New temporary email generated successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * email:
 * $ref: '#/components/schemas/TemporaryEmail'
 */

/**
 * @swagger
 * /temp-email/inbox:
 * get:
 * summary: Check the inbox for the user's temporary email
 * tags: [Temporary Email]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: The current state of the temporary email account, including all messages in the inbox.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * email:
 * $ref: '#/components/schemas/TemporaryEmail'
 * '404':
 * description: User does not have a temporary email address. Generate one first.
 */

/**
 * @swagger
 * /temp-email/forwarding:
 * patch:
 * summary: Update email forwarding settings
 * tags: [Temporary Email]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ForwardingSettingsRequest'
 * responses:
 * '200':
 * description: Forwarding settings updated successfully.
 * '404':
 * description: User does not have a temporary email address.
 */

/**
 * @swagger
 * /temp-email/{id}:
 * delete:
 * summary: Delete the temporary email address
 * tags: [Temporary Email]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the temporary email record to delete.
 * responses:
 * '204':
 * description: Temporary email deleted successfully.
 * '404':
 * description: The specified temporary email was not found.
 */