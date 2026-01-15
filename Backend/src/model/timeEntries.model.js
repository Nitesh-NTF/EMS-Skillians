import mongoose, { Schema } from "mongoose";

const timeEntriesSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        required: [true, "Project is required."],
        ref: "Project"
    },
    duration: {
        type: Number,
        required: [true, "Duration is required."],
        trim: true
    },
    startTime: {
        type: Number,
        required: [true, "Start time is required."]
    },
    endTime: {
        type: Number,
        required: [true, "End time is required."]
    },
    employee: {
        type: Schema.Types.ObjectId,
        required: [true, "Employee is required."],
        ref: "Employee"
    },
}, { timestamps: true });

export const TimeEntry = mongoose.model("TimeEntry", timeEntriesSchema);