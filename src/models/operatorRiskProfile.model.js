import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const operatorRiskProfileSchema = new Schema(
    {
        operatorId: {
            type: Schema.Types.ObjectId,
            ref: "Operator",
            required: true,
            unique: true,
            index: true,
        },
        district: {
            type: String,
            required: true,
            index: true,
        },
        riskScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 0,
        },
        riskLevel: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'CRITICAL'],
            required: true,
            default: 'LOW',
        },
        metrics: {
            avgEnrolmentTimeSec: { type: Number, default: 0 },
            biometricExceptionRate: { type: Number, default: 0 }, // as a percentage, e.g., 5 for 5%
            error310Rate: { type: Number, default: 0 }, // as a percentage
            activityHourVariance: { type: Number, default: 0 }, // represents deviation from normal hours
        },
        flags: {
            type: [String],
            default: [],
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to update the lastUpdated field
operatorRiskProfileSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

operatorRiskProfileSchema.plugin(mongooseAggregatePaginate);

export const OperatorRiskProfile = mongoose.model("OperatorRiskProfile", operatorRiskProfileSchema);

