/**
 * A centralized configuration object for the frontend application.
 * It reads environment variables exposed by Vite.
 */
export const config = {
    // The base URL for the Node.js Backend API Gateway.
    apiGatewayUrl: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api',

    // The base URL for the Python Compute Service, for direct file links.
    computeServiceUrl: import.meta.env.VITE_COMPUTE_SERVICE_URL || 'http://localhost:8000',
};
