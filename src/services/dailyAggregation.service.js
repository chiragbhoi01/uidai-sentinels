import { EnrolmentLog } from '../models/enrolmentLog.model.js';
import { DistrictRiskBaseline } from '../models/districtRiskBaseline.model.js';
import { riskService } from './riskCalculation.service.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * AGGREGATION PIPELINE:
 * Calculates the daily statistical baseline for each district.
 */
const runDistrictBaselineAggregation = async (date) => {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const pipeline = [
        // 1. Filter documents for the target day
        {
            $match: {
                timestamp: { $gte: startDate, $lte: endDate }
            }
        },
        // 2. Group by district to compute stats
        {
            $group: {
                _id: "$district",
                // Calculate mean and std dev for enrolment time
                meanEnrolmentTimeSec: { $avg: "$enrolmentTimeSec" },
                stdDevEnrolmentTimeSec: { $stdDevPop: "$enrolmentTimeSec" },
                // Calculate rate of biometric exceptions
                biometricExceptionRate: {
                    $avg: { $cond: ["$biometricExceptionUsed", 1, 0] }
                },
                // Calculate rate of error 310
                error310Rate: {
                    $avg: { $cond: [{ $eq: ["$errorCode", "310"] }, 1, 0] }
                },
                // Calculate variance of activity hours
                activityHourVariance: { $stdDevPop: { $hour: "$timestamp" } }
            }
        },
        // 3. Format the output and merge into the baseline collection
        {
            $project: {
                _id: 0,
                district: "$_id",
                date: { $dateToString: { format: "%Y-%m-%d", date: startDate } },
                metrics: {
                    meanEnrolmentTimeSec: { $ifNull: ["$meanEnrolmentTimeSec", 0] },
                    stdDevEnrolmentTimeSec: { $ifNull: ["$stdDevEnrolmentTimeSec", 0] },
                    biometricExceptionRate: { $multiply: [{ $ifNull: ["$biometricExceptionRate", 0] }, 100] }, // to percentage
                    error310Rate: { $multiply: [{ $ifNull: ["$error310Rate", 0] }, 100] }, // to percentage
                    activityHourVariance: { $ifNull: ["$activityHourVariance", 0] }
                }
            }
        },
        // 4. Merge results into the collection (upsert based on district and date)
        {
            $merge: {
                into: "districtriskbaselines",
                on: ["district", "date"],
                whenMatched: "replace",
                whenNotMatched: "insert"
            }
        }
    ];

    await EnrolmentLog.aggregate(pipeline);
};

/**
 * AGGREGATION PIPELINE:
 * Calculates daily performance metrics for each operator.
 */
const getOperatorDailyMetrics = async (date) => {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const pipeline = [
        // 1. Filter for the target day
        {
            $match: {
                timestamp: { $gte: startDate, $lte: endDate }
            }
        },
        // 2. Group by operator to compute their daily metrics
        {
            $group: {
                _id: "$operatorId",
                district: { $first: "$district" }, // Get the operator's district
                // Calculate personal averages and variances
                avgEnrolmentTimeSec: { $avg: "$enrolmentTimeSec" },
                biometricExceptionRate: { $avg: { $cond: ["$biometricExceptionUsed", 1, 0] } },
                error310Rate: { $avg: { $cond: [{ $eq: ["$errorCode", "310"] }, 1, 0] } },
                activityHourVariance: { $stdDevPop: { $hour: "$timestamp" } }
            }
        },
        // 3. Project for final format
        {
            $project: {
                _id: 0,
                operatorId: "$_id",
                district: "$district",
                date: { $dateToString: { format: "%Y-%m-%d", date: startDate } },
                metrics: {
                    avgEnrolmentTimeSec: { $ifNull: ["$avgEnrolmentTimeSec", 0] },
                    biometricExceptionRate: { $multiply: [{ $ifNull: ["$biometricExceptionRate", 0] }, 100] },
                    error310Rate: { $multiply: [{ $ifNull: ["$error310Rate", 0] }, 100] },
                    activityHourVariance: { $ifNull: ["$activityHourVariance", 0] }
                }
            }
        }
    ];

    return await EnrolmentLog.aggregate(pipeline);
};


/**
 * CRON-COMPATIBLE ORCHESTRATOR:
 * Main function to run the daily risk computation for a given date.
 */
const runDailyRiskComputation = async (dateString) => {
    if (!dateString) {
        throw new ApiError(400, "Date string (YYYY-MM-DD) is required.");
    }
    const computationDate = new Date(dateString);

    // Step 1: Compute and store district baselines for the day
    console.log(`Step 1: Running district baseline aggregation for ${dateString}...`);
    await runDistrictBaselineAggregation(computationDate);
    console.log("District baselines updated.");

    // Step 2: Compute daily metrics for all active operators
    console.log(`Step 2: Calculating daily metrics for all operators...`);
    const operatorMetrics = await getOperatorDailyMetrics(computationDate);
    console.log(`Found metrics for ${operatorMetrics.length} operators.`);
    if (operatorMetrics.length === 0) {
        return { message: "No operator activity found for the given date." };
    }
    
    // Step 3: Fetch all district baselines for the day into memory for quick access
    const districtBaselines = await DistrictRiskBaseline.find({ date: dateString });
    const baselineMap = new Map(districtBaselines.map(b => [b.district, b.metrics]));

    // Step 4: Iterate through each operator and calculate their risk score
    console.log("Step 3: Calculating risk scores...");
    let updatedCount = 0;
    for (const operatorData of operatorMetrics) {
        const districtBaseline = baselineMap.get(operatorData.district);
        if (!districtBaseline) {
            console.warn(`Skipping operator ${operatorData.operatorId} due to missing district baseline for ${operatorData.district}`);
            continue;
        }
        
        await riskService.calculateRiskProfileWithBaseline(operatorData, districtBaseline);
        updatedCount++;
    }

    console.log("Daily risk computation complete.");
    return {
        message: "Daily risk computation completed successfully.",
        processedDate: dateString,
        operatorsEvaluated: updatedCount,
    };
};


export const dailyAggregationService = {
    runDailyRiskComputation,
};
