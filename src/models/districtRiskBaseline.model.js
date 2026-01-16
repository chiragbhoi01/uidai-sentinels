import mongoose, { Schema } from "mongoose";

const districtRiskBaselineSchema = new Schema({
    district: {
        type: String,
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD format
        required: true
    },
    metrics: {
        meanEnrolmentTimeSec: { type: Number, required: true },
        stdDevEnrolmentTimeSec: { type: Number, required: true },
        biometricExceptionRate: { type: Number, required: true }, // As a percentage
        error310Rate: { type: Number, required: true }, // As a percentage
        activityHourVariance: { type: Number, required: true } // Std dev of activity hours
    }
});

// Create a compound index for efficient lookups
districtRiskBaselineSchema.index({ district: 1, date: 1 }, { unique: true });

export const DistrictRiskBaseline = mongoose.model("DistrictRiskBaseline", districtRiskBaselineSchema);
