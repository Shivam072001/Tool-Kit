/**
 * @swagger
 * tags:
 * name: Fake Data Generator
 * description: Generate various types of realistic fake data for testing and development.
 */

/**
 * @swagger
 * components:
 * schemas:
 * FakeDataOperation:
 * type: object
 * properties:
 * id:
 * type: string
 * description: The unique identifier for the generation record.
 * example: "60d0fe4f5311236168a109e3"
 * user:
 * type: string
 * description: The ID of the user who performed the operation.
 * example: "60d0fe4f5311236168a109ca"
 * operationType:
 * type: string
 * description: The type of data generated.
 * example: "user"
 * generationOptions:
 * type: object
 * description: The options used for this generation task.
 * properties:
 * count:
 * type: integer
 * example: 10
 * locale:
 * type: string
 * example: "en_US"
 *
 * CustomSchemaProperty:
 * type: object
 * properties:
 * fieldName:
 * type: string
 * description: The name of the custom field.
 * example: "product_id"
 * fieldType:
 * type: string
 * description: The Faker.js method to use for generation (e.g., 'string.uuid', 'commerce.price').
 * example: "string.uuid"
 *
 * GenerateDataRequest:
 * type: object
 * required:
 * - type
 * - count
 * properties:
 * type:
 * type: string
 * enum: [user, product, address, company, custom]
 * description: The predefined type of data to generate, or 'custom' for a custom schema.
 * example: "user"
 * count:
 * type: integer
 * description: The number of data records to generate.
 * example: 25
 * locale:
 * type: string
 * description: "The locale for data generation (e.g., 'en_US', 'fr_FR', 'ja_JP')."
 * example: "en_US"
 * customSchema:
 * type: array
 * description: "An array of custom field definitions. Required if type is 'custom'."
 * items:
 * $ref: '#/components/schemas/CustomSchemaProperty'
 *
 * GeneratedDataResponse:
 * type: object
 * properties:
 * statusCode:
 * type: integer
 * example: 200
 * data:
 * type: array
 * description: An array of the generated data objects.
 * items:
 * type: object
 * example:
 * - id: "1"
 * name: "John Doe"
 * email: "john.doe@example.com"
 * message:
 * type: string
 * example: "Success"
 * success:
 * type: boolean
 * example: true
 */

/**
 * @swagger
 * /fake-data/generate:
 * post:
 * summary: Generate fake data based on specified criteria
 * tags: [Fake Data Generator]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/GenerateDataRequest'
 * responses:
 * '200':
 * description: The generated fake data.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/GeneratedDataResponse'
 * '400':
 * description: Bad request (e.g., invalid type or missing custom schema).
 */

/**
 * @swagger
 * /fake-data/history:
 * get:
 * summary: Get history of all fake data generations
 * tags: [Fake Data Generator]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: A list of the user's past fake data generations.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: object
 * properties:
 * history:
 * type: array
 * items:
 * $ref: '#/components/schemas/FakeDataOperation'
 */

/**
 * @swagger
 * /fake-data/{id}:
 * delete:
 * summary: Delete a fake data generation history record
 * tags: [Fake Data Generator]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the generation record to delete.
 * example: "60d0fe4f5311236168a109e3"
 * responses:
 * '204':
 * description: History record deleted successfully.
 * '404':
 * description: The specified record was not found.
 */