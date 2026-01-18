import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const transactionSchema = new Schema(
    {
        packetId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        operatorId: {
            type: Schema.Types.ObjectId,
            ref: "Operator",
            required: true,
            index: true
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true
        },
        type: {
            type: String,
            enum: ['New', 'Update'],
            required: true
        },
        status: {
            type: String,
            enum: ['Success', 'Rejected'],
            required: true
        },
        anomalyType: {
            type: String,
            enum: ['None', 'Velocity', 'Biometric'],
            default: 'None'
        }
    },
    {
        timestamps: true
    }
);

transactionSchema.plugin(mongooseAggregatePaginate);

export const Transaction = mongoose.model("Transaction", transactionSchema);
