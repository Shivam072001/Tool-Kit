/**
 * @swagger
 * tags:
 *   name: Regex Tester
 *   description: Test regular expressions, save your favorite patterns, and manage your pattern history.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegexPattern:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60d0fe4f5311236168a109e6"
 *         user:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         name:
 *           type: string
 *           description: A user-friendly name for the pattern.
 *           example: "Email Validator"
 *         pattern:
 *           type: string
 *           description: The regular expression pattern.
 *           example: "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
 *         description:
 *           type: string
 *           nullable: true
 *           description: An optional description of what the pattern does.
 *           example: "Validates standard email addresses."
 *     TestPatternRequest:
 *       type: object
 *       required:
 *         - pattern
 *         - testString
 *       properties:
 *         pattern:
 *           type: string
 *           description: The regular expression to test.
 *           example: "\\d+"
 *         testString:
 *           type: string
 *           description: The string to test the pattern against.
 *           example: "There are 123 numbers in this string."
 *         flags:
 *           type: string
 *           description: "Regex flags to apply (e.g., 'g', 'i', 'm')."
 *           example: "g"
 *     TestPatternResult:
 *       type: object
 *       properties:
 *         matches:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of strings that matched the pattern.
 *           example: ["123"]
 *         executionTime:
 *           type: number
 *           description: The time taken for the regex engine to find matches, in milliseconds.
 *           example: 0.5
 *     SavePatternRequest:
 *       type: object
 *       required:
 *         - name
 *         - pattern
 *       properties:
 *         name:
 *           type: string
 *           example: "URL Finder"
 *         pattern:
 *           type: string
 *           example: "https?://[^\\s]+"
 *         description:
 *           type: string
 *           example: "Finds http and https URLs in text."
 */

/**
 * @swagger
 * /regex/test:
 *   post:
 *     summary: Test a regular expression pattern
 *     tags: [Regex Tester]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestPatternRequest'
 *     responses:
 *       '200':
 *         description: The result of the regex test.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TestPatternResult'
 *       '400':
 *         description: Bad request (e.g., invalid regex pattern).
 */

/**
 * @swagger
 * /regex:
 *   post:
 *     summary: Save a new regex pattern to history
 *     tags: [Regex Tester]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavePatternRequest'
 *     responses:
 *       '201':
 *         description: Pattern saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     pattern:
 *                       $ref: '#/components/schemas/RegexPattern'
 *   get:
 *     summary: Get the user's saved regex patterns
 *     tags: [Regex Tester]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's saved regex patterns.
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
 *                         $ref: '#/components/schemas/RegexPattern'
 */

/**
 * @swagger
 * /regex/{id}:
 *   delete:
 *     summary: Delete a saved regex pattern
 *     tags: [Regex Tester]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the pattern to delete.
 *           example: "60d0fe4f5311236168a109e6"
 *     responses:
 *       '204':
 *         description: Pattern deleted successfully.
 *       '404':
 *         description: The specified pattern was not found.
 */