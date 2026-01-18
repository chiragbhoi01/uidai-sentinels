import { Operator } from '../models/operator.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get overall risk summary
// @route   GET /api/v1/risk/summary
// @access  Public
const getRiskSummary = asyncHandler(async (req, res) => {
  let totalOperators, criticalRiskCount, highRiskCount, avgRiskResult, averageRiskScore;
  try {
    totalOperators = await Operator.countDocuments();
    console.log(`Debug: Total operators count: ${totalOperators}`);
  } catch (err) {
    console.error("Error in counting total operators:", err);
    throw new ApiError(500, "Failed to count total operators");
  }

  try {
    criticalRiskCount = await Operator.countDocuments({ riskScore: { $gt: 90 } });
    console.log(`Debug: Critical operators count: ${criticalRiskCount}`);
  } catch (err) {
    console.error("Error in counting critical operators:", err);
    throw new ApiError(500, "Failed to count critical operators");
  }

  try {
    highRiskCount = await Operator.countDocuments({ riskScore: { $gt: 70, $lte: 90 } });
    console.log(`Debug: High-risk operators count: ${highRiskCount}`);
  } catch (err) {
    console.error("Error in counting high-risk operators:", err);
    throw new ApiError(500, "Failed to count high-risk operators");
  }

  try {
    avgRiskResult = await Operator.aggregate([
      { $group: { _id: null, averageRiskScore: { $avg: '$riskScore' } } },
    ]);
    averageRiskScore = avgRiskResult.length > 0 ? avgRiskResult[0].averageRiskScore : 0;
    console.log(`Debug: Average risk score: ${averageRiskScore}`);
  } catch (err) {
    console.error("Error in aggregating average risk score:", err);
    throw new ApiError(500, "Failed to calculate average risk score");
  }

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
const getOperatorById = asyncHandler(async (req, res) => {
  const { operatorId } = req.params;
  const operator = await Operator.findOne({ operatorId }).lean();

  if (!operator) {
    throw new ApiError(404, 'Operator not found');
  }

  // --- Mock Data for Hackathon Demo ---
  // In a real system, this data would be calculated or joined from other collections.
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
    riskFactors: {
      velocity: { description: 'High Transaction Velocity', value: operator.riskScore * 0.4, contribution: 35 },
      biometric: { description: 'Biometric Exception Abuse', value: operator.riskScore * 0.3, contribution: 25 },
      errors: { description: 'High Error Rate', value: operator.riskScore * 0.15, contribution: 15 },
      oddHours: { description: 'Odd-Hour Activity', value: operator.riskScore * 0.15, contribution: 15 },
    },
    flags: [
      { description: 'Transaction velocity significantly higher than district average.', weight: 35 },
      { description: 'High rate of biometric exceptions recorded.', weight: 25 },
    ],
  };
  // --- End Mock Data ---

  const detailedProfile = { ...operator, ...mockData };

  return res
    .status(200)
    .json(new ApiResponse(200, detailedProfile, 'Operator details fetched successfully'));
});


export { getRiskSummary, getOperators, getOperatorById };
