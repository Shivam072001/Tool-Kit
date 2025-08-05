/**
 * @swagger
 * tags:
 *   name: Short URL
 *   description: Create, manage, and track shortened URLs. All endpoints under this tag require authentication.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShortUrl:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the shortened URL.
 *           example: "60d0fe4f5311236168a109ca"
 *         originalUrl:
 *           type: string
 *           format: uri
 *           description: The original, long URL.
 *           example: "https://www.google.com/search?q=long+url"
 *         shortCode:
 *           type: string
 *           description: The unique code for the shortened URL.
 *           example: "abC12D"
 *         fullShortUrl:
 *           type: string
 *           format: uri
 *           description: The full shortened URL that can be used for redirection.
 *           example: "http://localhost:3000/r/abC12D"
 *         clicks:
 *           type: integer
 *           description: The number of times the shortened URL has been clicked.
 *           example: 5
 *         maxClicks:
 *           type: integer
 *           nullable: true
 *           description: The maximum number of clicks allowed before the URL is disabled. Null means infinite.
 *           example: 100
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The date and time when the URL will expire and be disabled. Null means it never expires.
 *           example: "2025-12-31T23:59:59.000Z"
 *         isActive:
 *           type: boolean
 *           description: Indicates whether the URL is currently active and can be used for redirection.
 *           example: true
 *         user:
 *           type: string
 *           description: The ID of the user who created the URL.
 *           example: "60d0fe4f5311236168a109ca"
 *     CreateShortUrlRequest:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         originalUrl:
 *           type: string
 *           format: uri
 *           description: The URL you want to shorten.
 *           example: "https://www.very-long-and-complex-url.com/with/many/path/segments"
 *         maxClicks:
 *           type: integer
 *           description: "(Optional) Set a maximum number of clicks. The URL will be disabled after this limit is reached."
 *           example: 50
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: "(Optional) Set an expiration date and time for the URL."
 *           example: "2026-01-01T00:00:00.000Z"
 *     UpdateShortUrlRequest:
 *       type: object
 *       properties:
 *         newMaxClicks:
 *           type: integer
 *           description: A new maximum click limit for the URL.
 *           example: 200
 */

/**
 * @swagger
 * /urls:
 *   post:
 *     summary: Create a new shortened URL
 *     tags: [Short URL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShortUrlRequest'
 *     responses:
 *       '201':
 *         description: URL shortened successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: integer, example: 201 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       $ref: '#/components/schemas/ShortUrl'
 *                     message: { type: string, example: "URL shortened successfully" }
 *                     success: { type: boolean, example: true }
 *       '400':
 *         description: Bad request (e.g., invalid URL format).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all shortened URLs for the current user
 *     tags: [Short URL]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's shortened URLs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: integer, example: 200 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     urls:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ShortUrl'
 *                     results:
 *                       type: integer
 *                       example: 1
 *                     message: { type: string, example: "Success" }
 *                     success: { type: boolean, example: true }
 */

/**
 * @swagger
 * /urls/{id}:
 *   delete:
 *     summary: Delete a shortened URL
 *     tags: [Short URL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the shortened URL to delete.
 *           example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       '204':
 *         description: URL deleted successfully.
 *       '404':
 *         description: The specified URL was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /urls/{id}/disable:
 *   patch:
 *     summary: Disable a shortened URL
 *     tags: [Short URL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the shortened URL to disable.
 *           example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       '200':
 *         description: URL disabled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: integer, example: 200 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       $ref: '#/components/schemas/ShortUrl'
 *                     message: { type: string, example: "URL disabled" }
 *                     success: { type: boolean, example: true }
 *       '404':
 *         description: The specified URL was not found.
 */

/**
 * @swagger
 * /urls/{id}/enable:
 *   patch:
 *     summary: Enable a shortened URL
 *     tags: [Short URL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the shortened URL to enable.
 *           example: "60d0fe4f5311236168a109ca"
 *     requestBody:
 *       description: "(Optional) You can provide a new maximum click count when re-enabling the URL."
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShortUrlRequest'
 *     responses:
 *       '200':
 *         description: URL enabled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: integer, example: 200 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       $ref: '#/components/schemas/ShortUrl'
 *                     message: { type: string, example: "URL enabled" }
 *                     success: { type: boolean, example: true }
 *       '404':
 *         description: The specified URL was not found.
 */