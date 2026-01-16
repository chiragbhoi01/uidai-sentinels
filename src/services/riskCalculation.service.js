import { OperatorRiskProfile } from '../models/operatorRiskProfile.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Calculates the Z-Score for a given value using pre-calculated baselines.
 * Z = (X - μ) / σ
 * @param {number} value - The operator's metric value (X).
 * @param {number} mean - The district's mean for that metric (μ).
 * @param {number} stdDev - The district's standard deviation for that metric (σ).
 * @returns {number}
 */
const calculateZScore = (value, mean, stdDev) => {
    // Per requirements, if stdDev is 0, Z-score is 0 (no deviation from the norm).
    if (stdDev === 0) {
        return 0;
    }
    return (value - mean) / stdDev;
};

/**
 * Calculates risk score and updates the operator's profile using pre-calculated baselines.
 * @param {Object} operatorData - The aggregated daily metrics for an operator.
 * @param {Object} districtBaseline - The pre-calculated baseline for the operator's district.
 * @returns {Promise<Object>} The updated operator risk profile.
 */
const calculateRiskProfileWithBaseline = async (operatorData, districtBaseline) => {
    const { operatorId, district, metrics: operatorMetrics } = operatorData;

    // 1. Calculate Z-Scores for the operator's current metrics against the district baseline
    const zScores = {
        velocity: calculateZScore(operatorMetrics.avgEnrolmentTimeSec, districtBaseline.meanEnrolmentTimeSec, districtBaseline.stdDevEnrolmentTimeSec),
        biometricException: calculateZScore(operatorMetrics.biometricExceptionRate, districtBaseline.biometricExceptionRate, 15), // Assuming a static stdDev for rates for stability
        error310: calculateZScore(operatorMetrics.error310Rate, districtBaseline.error310Rate, 10), // Assuming a static stdDev
        oddHours: calculateZScore(operatorMetrics.activityHourVariance, districtBaseline.activityHourVariance, 2), // Assuming a static stdDev
    };

    // 2. Calculate final risk score based on weighted Z-Scores and add flags
    const flags = [];
    let riskScore = 0;
    
    // Weights for each metric's contribution to the score as per requirements
    const weights = {
        velocity: 0.30,
        biometricException: 0.25,
        error310: 0.30,
        oddHours: 0.15,
    };
    
    // Define Z-score thresholds for flagging
    const Z_THRESHOLD = 3.0;

    if (zScores.velocity > Z_THRESHOLD) flags.push("IMPOSSIBLE_VELOCITY");
    if (zScores.biometricException > Z_THRESHOLD) flags.push("EXCESSIVE_BIOMETRIC_EXCEPTION");
    if (zScores.error310 > Z_THRESHOLD) flags.push("DUPLICATE_FINGER_PATTERN");
    if (zScores.oddHours > Z_THRESHOLD) flags.push("ODD_HOUR_ACTIVITY");

    // A simple linear scoring model based on Z-score magnitude
    for (const key in zScores) {
        if (zScores[key] > 0) { // Only positive Z-scores (worse than average) contribute to risk
             riskScore += zScores[key] * 10 * weights[key];
        }
    }

    // 3. Normalize score to be within 0-100
    const finalRiskScore = Math.min(Math.round(riskScore), 100);

    // 4. Determine Risk Level
    let riskLevel;
    if (finalRiskScore >= 70) {
        riskLevel = 'CRITICAL';
    } else if (finalRiskScore >= 40) {
        riskLevel = 'MEDIUM';
    } else {
        riskLevel = 'LOW';
    }

    // 5. Update or create the operator's master risk profile
    const updatedProfile = await OperatorRiskProfile.findOneAndUpdate(
        { operatorId },
        {
            $set: {
                district,
                riskScore: finalRiskScore,
                riskLevel,
                metrics: operatorMetrics, // Store the latest daily metrics
                flags,
                lastUpdated: new Date(),
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!updatedProfile) {
        // This should ideally never happen with upsert: true
        throw new ApiError(500, "Failed to update or create operator risk profile during daily computation.");
    }
    
    return updatedProfile;
};

export const riskService = {
    calculateRiskProfileWithBaseline,
};