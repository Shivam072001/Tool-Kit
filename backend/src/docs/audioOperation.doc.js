/**
 * @swagger
 * tags:
 *   - name: Audio Operations
 *     description: Perform operations on audio files, such as transcription. These are asynchronous operations.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FileDetail:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *           example: "meeting-recording.mp3"
 *         filetype:
 *           type: string
 *           example: "audio/mpeg"
 *         size:
 *           type: number
 *           example: 1234567
 *
 *     AudioOperation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the audio operation record.
 *           example: "60d0fe4f5311236168a109e2"
 *         user:
 *           type: string
 *           description: The ID of the user who performed the operation.
 *           example: "60d0fe4f5311236168a109ca"
 *         operationType:
 *           type: string
 *           enum: [transcribe]
 *           description: The type of audio operation performed.
 *           example: "transcribe"
 *         taskId:
 *           type: string
 *           description: The ID of the task used to track async status.
 *           example: "bull:audio-handler:789"
 *         status:
 *           type: string
 *           enum: [processing, completed, failed]
 *           description: The current status of the job.
 *           example: "completed"
 *         source:
 *           $ref: '#/components/schemas/FileDetail'
 *         result:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *               nullable: true
 *               description: The transcribed text from the audio file.
 *               example: "Hello, this is a test transcription..."
 *         errorMessage:
 *           type: string
 *           nullable: true
 *           description: Details of the error if the job failed.
 *           example: "Audio format not supported."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-01T12:34:56.789Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-08-01T12:40:00.000Z"
 *         deleted:
 *           type: boolean
 *           example: false
 *
 *     AsyncJobStartResponse:
 *       type: object
 *       properties:
 *         taskId:
 *           type: string
 *           description: The task ID to poll for status.
 *           example: "bull:audio-handler:789"
 *         message:
 *           type: string
 *           example: "Transcription job started successfully."
 *
 *     JobStatusResponse:
 *       type: object
 *       properties:
 *         taskId:
 *           type: string
 *           example: "bull:audio-handler:789"
 *         status:
 *           type: string
 *           enum: [processing, completed, failed]
 *           example: "completed"
 *         result:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *               nullable: true
 *               example: "Hello, this is the transcribed content."
 *         errorMessage:
 *           type: string
 *           nullable: true
 *           example: "File could not be processed."
 */

/**
 * @swagger
 * /audio/transcribe:
 *   post:
 *     summary: Upload an audio file for transcription
 *     tags: [Audio Operations]
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
 *                 description: The audio file to be transcribed (e.g., .mp3, .wav, .m4a)
 *     responses:
 *       '202':
 *         description: Accepted for processing. The response contains a taskId to poll for the result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsyncJobStartResponse'
 *       '400':
 *         description: Bad request (e.g., no audio file uploaded).
 */

/**
 * @swagger
 * /audio/history:
 *   get:
 *     summary: Get history of all audio operations
 *     tags: [Audio Operations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's past audio operations.
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
 *                         $ref: '#/components/schemas/AudioOperation'
 */

/**
 * @swagger
 * /audio/status/{taskId}:
 *   get:
 *     summary: Get the status of an asynchronous audio operation job
 *     tags: [Audio Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The taskId received when the job was started.
 *         example: "bull:audio-handler:789"
 *     responses:
 *       '200':
 *         description: The current status of the job. The result object will contain the transcribed text.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobStatusResponse'
 *       '404':
 *         description: Task not found or expired.
 */

/**
 * @swagger
 * /audio/{id}:
 *   delete:
 *     summary: Delete an audio operation history record
 *     tags: [Audio Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the audio operation record to delete.
 *         example: "60d0fe4f5311236168a109e2"
 *     responses:
 *       '204':
 *         description: History record deleted successfully.
 *       '404':
 *         description: The specified record was not found.
 */
