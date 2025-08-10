/**
 * @swagger
 * tags:
 *   name: Currency Converter
 *   description: Convert between different currencies using the latest exchange rates and track your conversion history.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CurrencyRates:
 *       type: object
 *       properties:
 *         base:
 *           type: string
 *           description: The base currency for the rates.
 *           example: "USD"
 *         date:
 *           type: string
 *           format: date
 *           description: The date the rates were retrieved.
 *           example: "2025-08-03"
 *         rates:
 *           type: object
 *           additionalProperties:
 *             type: number
 *           description: An object mapping currency codes to their exchange rate against the base currency.
 *           example:
 *             EUR: 0.92
 *             JPY: 142.5
 *             GBP: 0.78
 *             INR: 83.5
 *     ConversionHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60d0fe4f5311236168a109e4"
 *         user:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         fromCurrency:
 *           type: string
 *           example: "USD"
 *         toCurrency:
 *           type: string
 *           example: "INR"
 *         amount:
 *           type: number
 *           example: 100
 *         result:
 *           type: number
 *           example: 8350
 *         rate:
 *           type: number
 *           example: 83.5
 *     SaveConversionRequest:
 *       type: object
 *       required:
 *         - fromCurrency
 *         - toCurrency
 *         - amount
 *         - result
 *         - rate
 *       properties:
 *         fromCurrency:
 *           type: string
 *           example: "GBP"
 *         toCurrency:
 *           type: string
 *           example: "EUR"
 *         amount:
 *           type: number
 *           example: 50
 *         result:
 *           type: number
 *           example: 58.97
 *         rate:
 *           type: number
 *           example: 1.1794
 */

/**
 * @swagger
 * /currency/rates:
 *   get:
 *     summary: Get the latest currency exchange rates
 *     tags: [Currency Converter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Latest currency rates retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CurrencyRates'
 */

/**
 * @swagger
 * /currency/history:
 *   post:
 *     summary: Save a currency conversion to the user's history
 *     tags: [Currency Converter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveConversionRequest'
 *     responses:
 *       '201':
 *         description: Conversion saved successfully.
 *   get:
 *     summary: Get the user's currency conversion history
 *     tags: [Currency Converter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's past conversions.
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
 *                         $ref: '#/components/schemas/ConversionHistory'
 */

/**
 * @swagger
 * /currency/history/{id}:
 *   delete:
 *     summary: Delete a currency conversion history record
 *     tags: [Currency Converter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the conversion history record to delete.
 *           example: "60d0fe4f5311236168a109e4"
 *     responses:
 *       '204':
 *         description: History record deleted successfully.
 *       '404':
 *         description: The specified record was not found.
 */