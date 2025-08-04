/**
 * @swagger
 * tags:
 * name: File Operations
 * description: Perform operations on files like compression, conversion, and background removal. These are asynchronous operations.
 */

/**
 * @swagger
 * components:
 * schemas:
 * FileOperation:
 * type: object
 * properties:
 * id:
 * type: string
 * description: The unique identifier for the file operation record.
 * example: "60d0fe4f5311236168a109e1"
 * user:
 * type: string
 * description: The ID of the user who performed the operation.
 * example: "60d0fe4f5311236168a109ca"
 * operationType:
 * type: string
 * enum: [compress, convert, remove-background]
 * description: The type of operation performed.
 * example: "compress"
 * originalFileName:
 * type: string
 * description: The name of the original uploaded file.
 * example: "vacation_photo.jpg"
 * status:
 * type: string
 * enum: [processing, completed, failed]
 * description: The current status of the job.
 * example: "completed"
 * resultFileUrl:
 * type: string
 * format: uri
 * nullable: true
 * description: The URL to download the processed file. Available when status is 'completed'.
 * example: "https://storage.googleapis.com/toolkit-processed-files/user123/compressed-vacation_photo.zip"
 * errorMessage:
 * type: string
 * nullable: true
 * description: Details of the error if the job failed.
 * example: "File format not supported."
 *
 * AsyncJobStartResponse:
 * type: object
 * properties:
 * statusCode:
 * type: integer
 * example: 202
 * data:
 * type: object
 * properties:
 * taskId:
 * type: string
 * description: The unique ID for the asynchronous job. Use this to poll for status.
 * example: "bull:file-handler:123"
 * message:
 * type: string
 * example: "File compression started"
 * success:
 * type: boolean
 * example: true
 *
 * JobStatusResponse:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [processing, completed, failed]
 * description: The current status of the job.
 * example: "completed"
 * result:
 * type: object
 * nullable: true
 * description: The result of the operation, available when status is 'completed'.
 * properties:
 * downloadUrl:
 * type: string
 * format: uri
 * example: "https://storage.googleapis.com/toolkit-processed-files/user123/result.zip"
 *
 * ConversionOptionsResponse:
 * type: object
 * properties:
 * statusCode:
 * type: integer
 * example: 200
 * data:
 * type: object
 * properties:
 * conversionMap:
 * type: object
 * description: An object mapping input formats to possible output formats.
 * example:
 * image: ["png", "webp", "gif"]
 * video: ["mp4", "webm", "avi"]
 *
 */

/**
 * @swagger
 * /file/options:
 * get:
 * summary: Get available file conversion options
 * tags: [File Operations]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: A map of possible file conversions.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ConversionOptionsResponse'
 */

/**
 * @swagger
 * /file/compress:
 * post:
 * summary: Upload a file for compression
 * tags: [File Operations]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * file:
 * type: string
 * format: binary
 * description: The file to be compressed.
 * responses:
 * '202':
 * description: Accepted for processing. The response contains a taskId to poll for the result.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AsyncJobStartResponse'
 * '400':
 * description: Bad request (e.g., no file uploaded).
 */

/**
 * @swagger
 * /file/convert:
 * post:
 * summary: Upload a file for conversion
 * tags: [File Operations]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * file:
 * type: string
 * format: binary
 * description: The file to be converted.
 * targetFormat:
 * type: string
 * description: The desired output format (e.g., 'png', 'mp4').
 * example: "webp"
 * responses:
 * '202':
 * description: Accepted for processing. Returns a taskId.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AsyncJobStartResponse'
 * '400':
 * description: Bad request (e.g., no file or targetFormat missing).
 */

/**
 * @swagger
 * /file/remove-background:
 * post:
 * summary: Upload an image to remove its background
 * tags: [File Operations]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * file:
 * type: string
 * format: binary
 * description: The image file (e.g., jpg, png).
 * responses:
 * '202':
 * description: Accepted for processing. Returns a taskId.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AsyncJobStartResponse'
 * '400':
 * description: Bad request (e.g., no file uploaded).
 */

/**
 * @swagger
 * /file/status/{taskId}:
 * get:
 * summary: Get the status of an asynchronous file operation job
 * tags: [File Operations]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: taskId
 * required: true
 * schema:
 * type: string
 * description: The taskId received when the job was started.
 * example: "bull:file-handler:123"
 * responses:
 * '200':
 * description: The current status of the job.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/JobStatusResponse'
 */

/**
 * @swagger
 * /file/{id}:
 * delete:
 * summary: Delete a file operation history record
 * tags: [File Operations]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the file operation record to delete.
 * example: "60d0fe4f5311236168a109e1"
 * responses:
 * '204':
 * description: History record deleted successfully.
 * '404':
 * description: The specified record was not found.
 */