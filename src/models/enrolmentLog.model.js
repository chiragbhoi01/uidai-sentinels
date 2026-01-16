import mongoose, { Schema } from "mongoose";

const enrolmentLogSchema = new Schema({
    operatorId: {
        type: Schema.Types.ObjectId,
        ref: "Operator",
        required: true,
        index: true
    },
    stationId: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true,
        index: true
    },
    enrolmentType: {
        type: String,
        enum: ["NEW", "UPDATE"],
        required: true
    },
    enrolmentTimeSec: {
        type: Number,
        required: true
    },
    biometricExceptionUsed: {
        type: Boolean,
        default: false
    },
    errorCode: {
        type: String, // Assuming a string code, e.g., "310", "0" for success
        default: null
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export const EnrolmentLog = mongoose.model("EnrolmentLog", enrolmentLogSchema);
