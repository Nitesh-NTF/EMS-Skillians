import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["PROJECT_EMPLOYEE_ADDED", "PROJECT_EMPLOYEE_REMOVED"],
            required: [true, "Notification type is required"]
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project ID is required"]
        },
        projectName: {
            type: String,
            required: [true, "Project name is required"],
            trim: true
        },
        affectedEmployeeIds: [{
            type: Schema.Types.ObjectId,
            ref: "Employee"
        }],
        triggeredBy: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: [true, "Admin ID who triggered is required"]
        },
        recipients: [{
            type: Schema.Types.ObjectId,
            ref: "Employee"
        }],
        isRead: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recipients: 1, createdAt: -1 });
notificationSchema.index({ triggeredBy: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
