/**
 * @swagger
 * tags:
 * name: Authentication
 * description: User authentication and account management
 */

/**
 * @swagger
 * components:
 * schemas:
 * User:
 * type: object
 * properties:
 * id:
 * type: string
 * description: The unique identifier for the user.
 * example: "60d0fe4f5311236168a109ca"
 * email:
 * type: string
 * format: email
 * description: The email address of the user.
 * example: "user@example.com"
 *
 * AuthResponse:
 * type: object
 * properties:
 * statusCode:
 * type: integer
 * example: 200
 * data:
 * type: object
 * properties:
 * user:
 * $ref: '#/components/schemas/User'
 * token:
 * type: string
 * description: JWT token for authentication.
 * example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * message:
 * type: string
 * example: "Login successful"
 * success:
 * type: boolean
 * example: true
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * description: A unique email address for the new user.
 * example: "newuser@example.com"
 * password:
 * type: string
 * format: password
 * description: The user's password (at least 6 characters).
 * example: "password123"
 * responses:
 * '201':
 * description: User registered successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * '400':
 * description: Bad request (e.g., validation error, duplicate email).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Log in an existing user
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * description: The user's email address.
 * example: "user@example.com"
 * password:
 * type: string
 * format: password
 * description: The user's password.
 * example: "password123"
 * responses:
 * '200':
 * description: User logged in successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * '401':
 * description: Unauthorized (e.g., incorrect email or password).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */