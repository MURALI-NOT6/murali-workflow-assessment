import apiClient from './apiClient';

/**
 * Incident API Services
 */
const IncidentService = {
    /**
     * Dispatches a new incident payload to the n8n webhook
     * @param {Object} payload 
     * @returns {Promise}
     */
    triggerIncident: async (payload) => {
        // The base URL is already configured in apiClient
        return await apiClient.post('/webhook/incident', payload);
    }
};

export default IncidentService;
