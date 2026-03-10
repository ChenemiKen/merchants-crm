import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Merchant CRM API',
            version: '1.0.0',
            description: 'API documentation for the Merchant CRM system',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                SignupSchema: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'password2'],
                    properties: {
                        name: { type: 'string', minLength: 2 },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                        password2: { type: 'string' }
                    }
                },
                LoginSchema: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' }
                    }
                },
                Merchant: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        category: { type: 'string' },
                        city: { type: 'string' },
                        contactEmail: { type: 'string', format: 'email' },
                        status: { type: 'string', enum: ['PENDING_KYB', 'ACTIVE', 'SUSPENDED'] }
                    }
                },
                UpdateMerchantStatus: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: { type: 'string', enum: ['PENDING_KYB', 'ACTIVE', 'SUSPENDED'] },
                        reason: { type: 'string' }
                    }
                },
                NotificationSubscriber: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        url: { type: 'string', format: 'uri' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                CreateNotificationSubscriber: {
                    type: 'object',
                    required: ['name', 'url', 'secret'],
                    properties: {
                        name: { type: 'string', minLength: 2 },
                        url: { type: 'string', format: 'uri' },
                        secret: { type: 'string', minLength: 8 }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
