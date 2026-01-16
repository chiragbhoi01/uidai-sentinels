import axios from "axios";

// This would typically be in a .env file
const API_BASE_URL = "http://localhost:8000/api/v1"; // Example backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Fetches operator risk data from the API.
 * For the hackathon, this function returns mock data to simulate a live backend.
 */
export const getOperatorRiskData = async () => {
  try {
    // Mocking a successful response for demonstration.
    // Replace this with the actual API call when the backend is ready.
    const mockData = {
      success: true,
      message: "Operators fetched successfully",
      data: [
        { operatorId: 'OP_8829_KAR', district: 'Bangalore South', riskScore: 88.5, riskLevel: 'CRITICAL', lastUpdated: '2026-01-16T10:00:00Z' },
        { operatorId: 'OP_1234_MAH', district: 'Mumbai City', riskScore: 75.2, riskLevel: 'HIGH', lastUpdated: '2026-01-16T09:30:00Z' },
        { operatorId: 'OP_5678_DEL', district: 'New Delhi', riskScore: 45.0, riskLevel: 'MEDIUM', lastUpdated: '2026-01-15T18:00:00Z' },
        { operatorId: 'OP_9101_UP', district: 'Lucknow', riskScore: 22.1, riskLevel: 'LOW', lastUpdated: '2026-01-16T11:00:00Z' },
        { operatorId: 'OP_2233_TN', district: 'Chennai', riskScore: 95.7, riskLevel: 'CRITICAL', lastUpdated: '2026-01-16T11:45:00Z' },
        { operatorId: 'OP_4455_GUJ', district: 'Ahmedabad', riskScore: 68.9, riskLevel: 'HIGH', lastUpdated: '2026-01-15T14:20:00Z' },
        { operatorId: 'OP_6677_WB', district: 'Kolkata', riskScore: 12.5, riskLevel: 'LOW', lastUpdated: '2026-01-16T08:15:00Z' },
      ],
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockData.data;

    /*
    // REAL API CALL:
    const response = await api.get("/operators/risk");
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch data");
    }
    */
  } catch (error) {
    console.error("Error fetching operator risk data:", error);
    // Re-throw a structured error for the hook to catch
    throw new Error(error.message || "An unknown error occurred while fetching operator data.");
  }
};

/**
 * Fetches detailed risk profile for a single operator.
 * For the hackathon, this function returns mock data to simulate a live backend.
 * @param {string} operatorId - The ID of the operator.
 */
export const getOperatorDetails = async (operatorId) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 750));

    // Mocking a successful response for demonstration.
    const mockDetails = {
      operatorId: operatorId,
      district: "Bangalore South",
      riskScore: 88.5,
      riskLevel: "CRITICAL",
      lastUpdated: "2026-01-16T14:00:00Z",
      metrics: {
        avgEnrolmentTimeSec: 620, // Operator is faster
        biometricExceptionRate: 0.35,
        rejectionRate310: 0.15,
        activityHourVariance: 0.9,
      },
      districtAverage: {
        avgEnrolmentTimeSec: 110, // District is slower
        biometricExceptionRate: 0.04,
        rejectionRate310: 0.01,
        activityHourVariance: 0.3,
      },
      flags: [
        "Enrolment speed is 5.6x faster than district average",
        "Biometric exception rate is 8.8x higher than average",
        "Error code 310 (Duplicate Finger) rate is 15x higher than average",
        "High variance in activity hours suggests inconsistent schedule",
      ],
    };
    
    return mockDetails;

    /*
    // REAL API CALL:
    const response = await api.get(`/operators/${operatorId}`);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || `Failed to fetch details for operator ${operatorId}`);
    }
    */
  } catch (error) {
    console.error(`Error fetching details for operator ${operatorId}:`, error);
    throw new Error(error.message || `An unknown error occurred while fetching details for operator ${operatorId}.`);
  }
};

/**
 * Fetches KPI summary for the global dashboard.
 */
export const getDashboardSummary = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        
        // Mock API response
        return {
            totalOperators: 12450,
            highRiskOperators: 342,
            criticalOperators: 87,
            avgDistrictRisk: 42.6,
        };

        /*
        // REAL API CALL:
        const response = await api.get('/dashboard/summary');
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch dashboard summary.');
        }
        */
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw new Error(error.message || 'An unknown error occurred while fetching the dashboard summary.');
    }
};

/**
 * Fetches the daily anomaly trend for the past 30 days.
 */
export const getAnomalyTrend = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 900)); // Simulate delay

        // Mock API response
        const trend = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            trend.push({
                date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
                count: Math.floor(Math.random() * (50 - 20 + 1)) + 20 + Math.floor(i/5),
            });
        }
        return trend;

        /*
        // REAL API CALL:
        const response = await api.get('/dashboard/anomalies');
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch anomaly trend.');
        }
        */
    } catch (error) {
        console.error('Error fetching anomaly trend:', error);
        throw new Error(error.message || 'An unknown error occurred while fetching the anomaly trend.');
    }
};

/**
 * Fetches the risk score breakdown for a single operator.
 * @param {string} operatorId - The ID of the operator.
 */
export const getRiskBreakdown = async (operatorId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

        // Mock API response based on provided contract
        return {
            totalRiskScore: 88.5,
            factors: [
              { metric: "avgEnrolmentTimeSec", operatorValue: 110, districtMean: 620, zScore: -3.4, weight: 0.30, contribution: 26.4 },
              { metric: "biometricExceptionRate", operatorValue: 0.35, districtMean: 0.04, zScore: 4.1, weight: 0.25, contribution: 25.6 },
              { metric: "rejectionRate310", operatorValue: 0.15, districtMean: 0.01, zScore: 3.8, weight: 0.25, contribution: 23.7 },
              { metric: "activityHourVariance", operatorValue: 0.9, districtMean: 0.3, zScore: 2.9, weight: 0.20, contribution: 12.8 }
            ]
        };

        /*
        // REAL API CALL:
        const response = await api.get(`/operators/${operatorId}/risk-breakdown`);
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch risk breakdown.');
        }
        */
    } catch (error) {
        console.error(`Error fetching risk breakdown for operator ${operatorId}:`, error);
        throw new Error(error.message || 'An unknown error occurred while fetching the risk breakdown.');
    }
};
