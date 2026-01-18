import axios from "axios";

// The base URL is now read from Vite's environment variables.
// VITE_API_BASE_URL should be set in the `.env` file in the `frontend` directory.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies/sessions
});

// A function to handle API responses and errors
const handleApiResponse = (response) => {
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "An API error occurred.");
};

const handleApiError = (error, context) => {
    console.error(`Error ${context}:`, error);
    if (error.response) {
        throw new Error(error.response.data.message || `A server error occurred during ${context}.`);
    } else if (error.request) {
        throw new Error(`No response from server during ${context}. Please check network or backend status.`);
    } else {
        throw new Error(error.message || `An unknown error occurred during ${context}.`);
    }
}

/**
 * Fetches the list of all operators.
 */
export const getOperators = async () => {
  try {
    const response = await api.get("/risk/operators");
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, "fetching operators");
  }
};

/**
 * Fetches detailed risk profile for a single operator.
 * @param {string} operatorId - The ID of the operator.
 */
export const getOperatorById = async (operatorId) => {
    try {
        const response = await api.get(`/risk/operators/${operatorId}`);
        return handleApiResponse(response);
    } catch (error) {
        handleApiError(error, `fetching details for operator ${operatorId}`);
    }
};

/**
 * Fetches KPI summary for the global dashboard.
 */
export const getDashboardSummary = async () => {
    try {
        const response = await api.get('/risk/summary');
        return handleApiResponse(response);
    } catch (error) {
        handleApiError(error, 'fetching dashboard summary');
    }
};

// Note: The following functions might not have corresponding backend endpoints yet
// but are kept for future use or can be adapted.

/**
 * Fetches the daily anomaly trend.
 * This is a placeholder; you might need a dedicated backend endpoint for this.
 */
export const getAnomalyTrend = async () => {
    try {
        const response = await api.get('/risk/anomalies/trend');
        return handleApiResponse(response);
    } catch (error) {
        handleApiError(error, 'fetching anomaly trend');
    }
};
