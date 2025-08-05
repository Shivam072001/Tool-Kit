/**
 * @swagger
 * tags:
 *   name: Text Operations
 *   description: Perform AI-powered operations on text and documents, such as summarization and grammar checking. These are asynchronous operations.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TextOperation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the text operation record.
 *           example: "60d0fe4f5311236168a109f2"
 *         user:
 *           type: string
 *           description: The ID of the user who performed the operation.
 *           example: "60d0fe4f5311236168a109ca"
 *         operationType:
 *           type: string
 *           enum: [summarize, grammar-check]
 *           description: The type of text operation performed.
 *           example: "summarize"
 *         originalContent:
 *           type: string
 *           description: The original text or file name submitted for processing.
 *           example: "My Research Paper.pdf"
 *         resultContent:
 *           type: string
 *           nullable: true
 *           description: The processed text result, such as a summary or corrected grammar.
 *           example: "This paper discusses the impact of AI on modern software development..."
 *         status:
 *           type: string
 *           enum: [processing, completed, failed]
 *           description: The current status of the job.
 *           example: "completed"
 *         errorMessage:
 *           type: string
 *           nullable: true
 *           description: Details of the error if the job failed.
 *     GrammarCheckRequest:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: The block of text to be checked for grammar and spelling.
 *           example: "Ths is a sentance with severel mistakes."
 *     AsyncJobStartResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 202
 *         data:
 *           type: object
 *           properties:
 *             taskId:
 *               type: string
 *               description: The unique ID for the asynchronous job. Use this to poll for status.
 *               example: "bull:file-handler:123"
 *             message:
 *               type: string
 *               example: "File compression started"
 *             success:
 *               type: boolean
 *               example: true
 *     JobStatusResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [processing, completed, failed]
 *           description: The current status of the job.
 *           example: "completed"
 *         result:
 *           type: object
 *           nullable: true
 *           description: The result of the operation, available when status is 'completed'.
 *           properties:
 *             downloadUrl:
 *               type: string
 *               format: uri
 *               example: "https://storage.googleapis.com/toolkit-processed-files/user123/result.zip"
 */

/**
 * @swagger
 * /text/summarize-document:
 *   post:
 *     summary: Upload a document for summarization
 *     tags: [Text Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The document file to be summarized (e.g., .txt, .pdf, .docx).
 *     responses:
 *       '202':
 *         description: Accepted for processing. The response contains a taskId to poll for the result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsyncJobStartResponse'
 *       '400':
 *         description: Bad request (e.g., no file uploaded).
 */

/**
 * @swagger
 * /text/check-grammar:
 *   post:
 *     summary: Submit text for grammar checking
 *     tags: [Text Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrammarCheckRequest'
 *     responses:
 *       '202':
 *         description: Accepted for processing. The response contains a taskId.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsyncJobStartResponse'
 *       '400':
 *         description: Bad request (e.g., no text provided).
 */

/**
 * @swagger
 * /text/history:
 *   get:
 *     summary: Get history of all text operations
 *     tags: [Text Operations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's past text operations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TextOperation'
 */

/**
 * @swagger
 * /text/status/{taskId}:
 *   get:
 *     summary: Get the status of an asynchronous text operation job
 *     tags: [Text Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           description: The taskId received when the job was started.
 *           example: "bull:text-handler:456"
 *     responses:
 *       '200':
 *         description: The current status of the job.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobStatusResponse'
 */

/**
 * @swagger
 * /text/{id}:
 *   delete:
 *     summary: Delete a text operation history record
 *     tags: [Text Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the text operation record to delete.
 *           example: "60d0fe4f5311236168a109f2"
 *     responses:
 *       '204':
 *         description: History record deleted successfully.
 *       '404':
 *         description: The specified record was not found.
 */