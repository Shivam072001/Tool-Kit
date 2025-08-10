/**
 * @swagger
 * tags:
 *   name: Text Difference
 *   description: Compare two blocks of text and save the differences for later review.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TextDiff:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60d0fe4f5311236168a109e7"
 *         user:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         originalText:
 *           type: string
 *           description: The first block of text.
 *           example: "This is the original text."
 *         modifiedText:
 *           type: string
 *           description: The second block of text to compare against the first.
 *           example: "This is the modified text."
 *         name:
 *           type: string
 *           description: A user-provided name for the saved diff.
 *           example: "My Document v1 vs v2"
 *     SaveDiffRequest:
 *       type: object
 *       required:
 *         - name
 *         - originalText
 *         - modifiedText
 *       properties:
 *         name:
 *           type: string
 *           description: A name to identify this saved text comparison.
 *           example: "Blog Post - Draft 1 vs Draft 2"
 *         originalText:
 *           type: string
 *           description: The original (or left-side) text.
 *           example: "The quick brown fox jumps over the lazy dog."
 *         modifiedText:
 *           type: string
 *           description: The modified (or right-side) text.
 *           example: "The quick brown fox leaped over the lazy cat."
 */

/**
 * @swagger
 * /text-diff:
 *   post:
 *     summary: Save a new text difference comparison
 *     tags: [Text Difference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveDiffRequest'
 *     responses:
 *       '201':
 *         description: Diff saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     diff:
 *                       $ref: '#/components/schemas/TextDiff'
 *   get:
 *     summary: Get the user's saved text differences
 *     tags: [Text Difference]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's saved text differences.
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
 *                         $ref: '#/components/schemas/TextDiff'
 */

/**
 * @swagger
 * /text-diff/{id}:
 *   delete:
 *     summary: Delete a saved text difference
 *     tags: [Text Difference]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the text diff to delete.
 *           example: "60d0fe4f5311236168a109e7"
 *     responses:
 *       '204':
 *         description: Diff deleted successfully.
 *       '404':
 *         description: The specified diff was not found.
 */