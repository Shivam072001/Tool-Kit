/**
 * @swagger
 * tags:
 * name: Metadata Inspector
 * description: Inspect the hidden metadata of your files and manage your inspection history.
 */

/**
 * @swagger
 * components:
 * schemas:
 * MetadataOperation:
 * type: object
 * properties:
 * id:
 * type: string
 * example: "60d0fe4f5311236168a109e8"
 * user:
 * type: string
 * example: "60d0fe4f5311236168a109ca"
 * fileName:
 * type: string
 * description: The name of the inspected file.
 * example: "document.pdf"
 * metadata:
 * type: object
 * description: The extracted metadata from the file. The structure of this object varies depending on the file type.
 * example:
 * FileType: "PDF"
 * MIMEType: "application/pdf"
 * PDFVersion: 1.7
 * Title: "My Research Paper"
 * Author: "John Doe"
 *
 * MetadataInspectionResponse:
 * type: object
 * properties:
 * statusCode:
 * type: integer
 * example: 200
 * data:
 * type: object
 * properties:
 * metadata:
 * $ref: '#/components/schemas/MetadataOperation'
 * message:
 * type: string
 * example: "Success"
 * success:
 * type: boolean
 * example: true
 */

/**
 * @swagger
 * /metadata/inspect:
 * post:
 * summary: Inspect a file to extract its metadata
 * tags: [Metadata Inspector]
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
 * description: The file to be inspected.
 * responses:
 * '200':
 * description: Metadata extracted successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MetadataInspectionResponse'
 * '400':
 * description: Bad request (e.g., no file uploaded).
 */

/**
 * @swagger
 * /metadata/history:
 * get:
 * summary: Get the user's file inspection history
 * tags: [Metadata Inspector]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: A list of the user's past file inspections.
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
 * $ref: '#/components/schemas/MetadataOperation'
 */

/**
 * @swagger
 * /metadata/history/{id}:
 * delete:
 * summary: Delete a file inspection history record
 * tags: [Metadata Inspector]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the inspection record to delete.
 * example: "60d0fe4f5311236168a109e8"
 * responses:
 * '204':
 * description: History record deleted successfully.
 * '404':
 * description: The specified record was not found.
 */