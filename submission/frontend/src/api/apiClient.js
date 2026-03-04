import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:5678', // Base URL for the n8n webhook
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can modify the request config before sending it
        // e.g., adding dynamic headers or authentication tokens
        console.log(`[API Request] -> ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Process successful responses
        console.log(`[API Response] <- ${response.status} ${response.config.url}`);
        return response.data; // Return the data directly
    },
    (error) => {
        // Handle global API errors here
        if (error.response) {
            console.error(`[API Error] <- ${error.response.status} ${error.response.config.url}`, error.response.data);
        } else if (error.request) {
            console.error('[API Error] No response received', error.request);
        } else {
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
