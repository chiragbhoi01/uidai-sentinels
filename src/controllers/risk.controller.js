import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dailyAggregationService } from "../services/dailyAggregation.service.js";
import { OperatorRiskProfile } from "../models/operatorRiskProfile.model.js";
import mongoose from "mongoose";

/**
 * @description Get a paginated list of operators with filtering and sorting.
 * @route GET /api/v1/risk/operators
 * @access Public (for demo)
 */
const getOperators = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        riskLevel,
        district,
        sortBy = 'riskScore',
        sortOrder = 'desc'
    } = req.query;

    const pipeline = [];

    // --- Filtering Stage ---
    const matchStage = {};
    if (riskLevel) {
        const validRiskLevels = ['LOW', 'MEDIUM', 'CRITICAL'];
        const upperCaseRiskLevel = riskLevel.toUpperCase();
        if (validRiskLevels.includes(upperCaseRiskLevel)) {
            matchStage.riskLevel = upperCaseRiskLevel;
        } else {
            throw new ApiError(400, `Invalid riskLevel. Must be one of: ${validRiskLevels.join(', ')}`);
        }
    }
    if (district) {
        matchStage.district = { $regex: district, $options: 'i' }; // Case-insensitive search
    }
    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    // --- Populate Operator Details Stage ---
    pipeline.push({
        $lookup: {
            from: "operators",
            localField: "operatorId",
            foreignField: "_id",
            as: "operatorInfo"
        }
    }, {
        $unwind: { // Deconstruct the array to an object
            path: "$operatorInfo",
            preserveNullAndEmptyArrays: true // Keep profiles even if operator is deleted
        }
    });
    
    // --- Sorting Stage ---
    const sortStage = {};
    sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: sortStage });
    
    const aggregate = OperatorRiskProfile.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const operators = await OperatorRiskProfile.aggregatePaginate(aggregate, options);

    if (!operators || operators.docs.length === 0) {
        return res.status(200).json(new ApiResponse(200, {}, "No operators found matching the criteria."));
    }
    
    return res.status(200).json(
        new ApiResponse(200, operators, "Operators fetched successfully.")
    );
});


/**
 * @description Get a single operator's detailed risk profile.
 * @route GET /api/v1/risk/operators/:operatorId
 * @access Public (for demo)
 */
const getOperatorById = asyncHandler(async (req, res) => {
    const { operatorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(operatorId)) {
        throw new ApiError(400, "Invalid Operator ID format.");
    }
    
    const profile = await OperatorRiskProfile.findOne({ operatorId })
                                            .populate('operatorId', 'name operatorId status stationId');

    if (!profile) {
        throw new ApiError(404, "Operator risk profile not found.");
    }

    return res.status(200).json(new ApiResponse(200, profile, "Operator profile fetched successfully."));
});


/**
 * @description Get a summary of risk levels for a district or all districts.
 * @route GET /api/v1/risk/summary
 * @access Public (for demo)
 */
const getRiskSummary = asyncHandler(async (req, res) => {
    const { district } = req.query;

    const pipeline = [];

    // Optional filtering by district
    if (district) {
        pipeline.push({ $match: { district: { $regex: district, $options: 'i' } } });
    }

    // Grouping and counting
    pipeline.push({
        $group: {
            _id: "$riskLevel",
            count: { $sum: 1 }
        }
    });

    const summaryResult = await OperatorRiskProfile.aggregate(pipeline);

    const summary = {
        LOW: 0,
        MEDIUM: 0,
        CRITICAL: 0
    };

    summaryResult.forEach(item => {
        if (summary.hasOwnProperty(item._id)) {
            summary[item._id] = item.count;
        }
    });
    
    return res.status(200).json(new ApiResponse(200, summary, "Risk summary fetched successfully."));
});

/**
 * @description Trigger the daily risk computation for a specific date.
 * @route POST /api/v1/risk/run-daily
 * @access Admin (for demo)
 */
const runDailyComputation = asyncHandler(async (req, res) => {
    const { date } = req.body; // Expecting date in "YYYY-MM-DD" format

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new ApiError(400, "A 'date' field in 'YYYY-MM-DD' format is required.");
    }

    const result = await dailyAggregationService.runDailyRiskComputation(date);

    return res.status(200).json(new ApiResponse(200, result, "Daily risk computation process triggered successfully."));
});


export {
    getOperators,
    getOperatorById,
    getRiskSummary,
    runDailyComputation,
};