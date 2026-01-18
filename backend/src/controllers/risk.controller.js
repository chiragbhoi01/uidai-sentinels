import { Operator } from '../models/operator.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get overall risk summary
// @route   GET /api/v1/risk/summary
// @access  Public
const getRiskSummary = asyncHandler(async (req, res) => {
  const totalOperators = await Operator.countDocuments();
  const criticalRiskCount = await Operator.countDocuments({ riskScore: { $gt: 90 } });
  const highRiskCount = await Operator.countDocuments({ riskScore: { $gt: 70, $lte: 90 } });

  const avgRiskResult = await Operator.aggregate([
    { $group: { _id: null, averageRiskScore: { $avg: '$riskScore' } } },
  ]);
  
  const averageRiskScore = avgRiskResult.length > 0 ? avgRiskResult[0].averageRiskScore : 0;

  const summary = {
    totalOperators,
    criticalRiskCount,
    highRiskCount,
    averageRiskScore,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, summary, 'Risk summary fetched successfully'));
});

// @desc    Get all operators with their risk scores
// @route   GET /api/v1/risk/operators
// @access  Public
const getOperators = asyncHandler(async (req, res) => {
  const operators = await Operator.find().sort({ riskScore: -1 }).lean();

  if (!operators) {
    throw new ApiError(404, 'No operators found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, operators, 'Operators fetched successfully'));
});

// @desc    Get a single operator's detailed profile
// @route   GET /api/v1/risk/operators/:operatorId
// @access  Public
import { calculateRiskScore } from '../services/riskCalculation.service.js';

// ... (other controller code)

const getOperatorById = asyncHandler(async (req, res) => {
  const { operatorId } = req.params;
  const operator = await Operator.findOne({ operatorId }); // Not lean, as we may save it

  if (!operator) {
    throw new ApiError(404, 'Operator not found');
  }

  // Recalculate for live flags and risk factors
  const { flags, riskFactors } = await calculateRiskScore(operator);

  // --- Mock Data for other parts of the detail view ---
  const mockData = {
    metrics: {
      avgEnrolmentTime: 120 + Math.random() * 50,
      biometricExceptionRate: 0.05 + Math.random() * 0.1,
      errorRate: 0.02 + Math.random() * 0.05,
      demographicChangeRate: 0.1 + Math.random() * 0.1,
      oddHourActivityRate: 0.01 + Math.random() * 0.08,
    },
    districtAverages: {
      avgEnrolmentTime: 150,
      biometricExceptionRate: 0.04,
      errorRate: 0.03,
      demographicChangeRate: 0.15,
      oddHourActivityRate: 0.02,
    },
    // riskFactors are now dynamically calculated
  };
  // --- End Mock Data ---

  const detailedProfile = { ...operator.toObject(), ...mockData, flags, riskFactors };

  return res
    .status(200)
    .json(new ApiResponse(200, detailedProfile, 'Operator details fetched successfully'));
});

// ... (imports and other functions)
import { Transaction } from '../models/transaction.model.js';


const getAnomalyTrend = asyncHandler(async (req, res) => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 14);
    fourteenDaysAgo.setUTCHours(0, 0, 0, 0);

    const trend = await Transaction.aggregate([
        {
            $match: {
                timestamp: { $gte: fourteenDaysAgo },
                anomalyType: { $ne: 'None' }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                anomalies: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                anomalies: "$anomalies"
            }
        }
    ]);

    // To make the chart look better, let's also get the average risk score trend
    const riskTrend = await Operator.aggregate([
         {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                riskLevel: { $avg: '$riskScore' }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
             $project: {
                _id: 0,
                date: "$_id",
                riskLevel: "$riskLevel"
            }
        }
    ]);
    
    // Naive merge for demo, a real app would be more robust
    const finalTrend = trend.map(t => {
        const correspondingRisk = riskTrend.find(r => r.date === t.date);
        return { ...t, riskLevel: correspondingRisk ? correspondingRisk.riskLevel : Math.random() * 20 + 30 };
    });


    return res
        .status(200)
        .json(new ApiResponse(200, finalTrend, 'Anomaly trend fetched successfully'));
});


export { getRiskSummary, getOperators, getOperatorById, getAnomalyTrend };
