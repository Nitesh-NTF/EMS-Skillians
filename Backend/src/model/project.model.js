import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Project name is required."],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required."],
        trim: true
    },
    client: {
        type: String,
        required: [true, "Client is required."],
        trim: true
    },
    duration: {
        type: Number,
        default: 0
    },
    estimatedHours: {
        type: Number,
        required: [true, "Estimated hours is required."],
        min: [1, "Estimated hours must be at least 1"]
    },
    status: {
        type: String,
        enum: ["Pending", "Start", "In Progress", "Blocked", "Complete"],
        default: "Active"
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: String,
        required: [true, "Start date is required."]
    },
    endDate: {
        type: String,
        required: [true, "End date is required."]
    },
    icon: {
        type: String,
    },
    employees: [{
        type: Schema.Types.ObjectId,
        ref: "Employee"
    }],
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);