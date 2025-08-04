/**
 * @swagger
 * tags:
 * name: QR Code
 * description: Generate, manage, and track dynamic QR codes. All endpoints require authentication.
 */

/**
 * @swagger
 * components:
 * schemas:
 * QRCode:
 * type: object
 * properties:
 * id:
 * type: string
 * description: The unique identifier for the QR code.
 * example: "60d0fe4f5311236168a109cc"
 * originalUrl:
 * type: string
 * format: uri
 * description: The URL the QR code points to.
 * example: "https://github.com/shivam072001"
 * shortCode:
 * type: string
 * description: The unique short code associated with the QR code's redirect URL.
 * example: "qrXYZ123"
 * fullShortUrl:
 * type: string
 * format: uri
 * description: The full redirect URL for the QR code.
 * example: "http://localhost:3000/r/qrXYZ123"
 * qrCodeDataUrl:
 * type: string
 * format: uri
 * description: A data URL representing the QR code image in PNG format.
 * example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 * scans:
 * type: integer
 * description: The number of times the QR code has been scanned.
 * example: 15
 * maxScans:
 * type: integer
 * nullable: true
 * description: Maximum number of scans allowed. Null for unlimited.
 * example: 100
 * isActive:
 * type: boolean
 * description: Whether the QR code is currently active.
 * example: true
 * user:
 * type: string
 * description: The ID of the user who created the QR code.
 * example: "60d0fe4f5311236168a109ca"
 *
 * CreateQRCodeRequest:
 * type: object
 * required:
 * - originalUrl
 * properties:
 * originalUrl:
 * type: string
 * format: uri
 * description: The destination URL for the QR code.
 * example: "https://www.linkedin.com/in/shivam-singh-patel/"
 * maxScans:
 * type: integer
 * description: "(Optional) Set a maximum scan limit."
 * example: 250
 *
 * UpdateQRCodeRequest:
 * type: object
 * properties:
 * newMaxScans:
 * type: integer
 * description: A new maximum scan limit for the QR code.
 * example: 500
 */

/**
 * @swagger
 * /qr-code:
 * post:
 * summary: Create a new QR code
 * tags: [QR Code]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateQRCodeRequest'
 * responses:
 * '201':
 * description: QR Code created successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * qrCode:
 * $ref: '#/components/schemas/QRCode'
 * '400':
 * description: Bad request (e.g., invalid URL).
 *
 * get:
 * summary: Get all QR codes for the current user
 * tags: [QR Code]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: A list of the user's QR codes.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * qrCodes:
 * type: array
 * items:
 * $ref: '#/components/schemas/QRCode'
 */

/**
 * @swagger
 * /qr-code/{id}:
 * delete:
 * summary: Delete a QR code
 * tags: [QR Code]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the QR code to delete.
 * responses:
 * '204':
 * description: QR code deleted successfully.
 * '404':
 * description: QR code not found.
 */

/**
 * @swagger
 * /qr-code/{id}/disable:
 * patch:
 * summary: Disable a QR code
 * tags: [QR Code]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the QR code to disable.
 * responses:
 * '200':
 * description: QR code disabled successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * qrCode:
 * $ref: '#/components/schemas/QRCode'
 * '404':
 * description: QR code not found.
 */

/**
 * @swagger
 * /qr-code/{id}/enable:
 * patch:
 * summary: Enable a QR code
 * tags: [QR Code]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the QR code to enable.
 * requestBody:
 * description: "(Optional) You can provide a new maximum scan count when re-enabling."
 * required: false
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UpdateQRCodeRequest'
 * responses:
 * '200':
 * description: QR code enabled successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * qrCode:
 * $ref: '#/components/schemas/QRCode'
 * '404':
 * description: QR code not found.
 */