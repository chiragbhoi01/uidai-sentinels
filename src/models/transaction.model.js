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
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
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
            enum: ['Velocity', 'Biometric', 'None'],
            default: 'None'
        }
    },
    {
        timestamps: true
    }
);

transactionSchema.plugin(mongooseAggregatePaginate);

export const Transaction = mongoose.model("Transaction", transactionSchema);
