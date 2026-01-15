import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    department: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    icon: {
        type: String,
    },
    role: {
        type: [{ type: String }],
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
}, { timestamps: true });


export const Employee = mongoose.model("Employee", employeeSchema);
