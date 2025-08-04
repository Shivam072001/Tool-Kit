// backend/src/config/swagger.config.js

import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Tool-Kit API',
        version: '1.0.0',
        description:
            'This is the official API documentation for the Tool-Kit application. It provides a comprehensive suite of developer utilities, from file conversion and data generation to security tools and text analysis. All endpoints are secured and require authentication unless otherwise specified.',
        contact: {
            name: 'Shivam',
            email: 'shivam.singh072001@gmail.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    statusCode: { type: 'integer' },
                    message: { type: 'string' },
                    success: { type: 'boolean', default: false },
                },
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/docs/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);