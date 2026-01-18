import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const operatorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        operatorId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        stationId: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
            index: true
        },
        state: {
            type: String,
            required: true
        },
        riskScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
            index: true
        },
        status: {
            type: String,
            enum: ['Active', 'Blocked', 'Suspicious'],
            default: 'Active'
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

operatorSchema.plugin(mongooseAggregatePaginate);

export const Operator = mongoose.model("Operator", operatorSchema);
