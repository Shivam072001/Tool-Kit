// backend/src/docs/colorPalette.docs.js

/**
 * @swagger
 * tags:
 *   name: Color Palette
 *   description: Create, save, and manage color palettes for your design projects.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ColorPalette:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the saved palette.
 *           example: "60d0fe4f5311236168a109e5"
 *         user:
 *           type: string
 *           description: The ID of the user who saved the palette.
 *           example: "60d0fe4f5311236168a109ca"
 *         name:
 *           type: string
 *           description: The name of the color palette.
 *           example: "Ocean Breeze"
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           description: A hex color code.
 *           example: ["#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA"]
 *     SavePaletteRequest:
 *       type: object
 *       required:
 *         - name
 *         - colors
 *       properties:
 *         name:
 *           type: string
 *           description: The name for the new palette.
 *           example: "Sunset Vibes"
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *             format: hex-color
 *           description: An array of hex color strings.
 *           example: ["#FFCC80", "#FFB74D", "#FFA726", "#FF9800"]
 */

/**
 * @swagger
 * /colors:
 *   post:
 *     summary: Save a new color palette
 *     tags: [Color Palette]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavePaletteRequest'
 *     responses:
 *       '201':
 *         description: Palette saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     palette:
 *                       $ref: '#/components/schemas/ColorPalette'
 *       '400':
 *         description: Bad request (e.g., name or colors missing).
 *   get:
 *     summary: Get all saved color palettes for the user
 *     tags: [Color Palette]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's saved color palettes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     palettes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ColorPalette'
 */

/**
 * @swagger
 * /colors/{id}:
 *   delete:
 *     summary: Delete a saved color palette
 *     tags: [Color Palette]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the color palette to delete.
 *           example: "60d0fe4f5311236168a109e5"
 *     responses:
 *       '204':
 *         description: Palette deleted successfully.
 *       '404':
 *         description: The specified palette was not found.
 */