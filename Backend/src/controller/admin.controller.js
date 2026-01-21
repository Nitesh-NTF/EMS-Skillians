import { Employee } from "../model/employee.model.js";
import { Project } from "../model/project.model.js";
import { TimeEntry } from "../model/timeEntries.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/cutomResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Total current employees (Active status)
    const totalEmployees = await Employee.countDocuments({ status: "Active" });

    // Total projects
    const totalProjects = await Project.countDocuments();

    // Total work hours for current month
    const totalWorkHours = await TimeEntry.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lt: new Date(currentYear, currentMonth + 1, 1)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalHours: { $sum: "$duration" }
            }
        }
    ]);

    // Projects by status
    const projectStats = await Project.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const statusCounts = {
        Start: 0,
        "In Progress": 0,
        Pending: 0,
        Blocked: 0,
        Complete: 0
    };

    projectStats.forEach(stat => {
        if (statusCounts.hasOwnProperty(stat._id)) {
            statusCounts[stat._id] = stat.count;
        }
    });

    const projectsByStatus = {
        Start: {
            color: "#DE29A7",
            status: "Projects not Started",
            description: `🚀 ${statusCounts.Start} projects not yet started`,
            count: statusCounts.Start
        },
        Pending: {
            color: "#3B8BE7",
            status: "Total Pending projects",
            description: `⏳ ${statusCounts.Pending} projects pending approval`,
            count: statusCounts.Pending
        },
        "In Progress": {
            color: "#E7873B",
            status: "In Progress/Active projects",
            description: `🔥 ${statusCounts["In Progress"]} active projects this month`,
            count: statusCounts["In Progress"]
        },
        Complete: {
            color: "#09883E",
            status: "Completed Projects",
            description: `✅ ${statusCounts.Complete} projects completed successfully`,
            count: statusCounts.Complete
        },
        Blocked: {
            color: "#FF4444",
            status: "Blocked Projects",
            description: `🚫 ${statusCounts.Blocked} projects are blocked`,
            count: statusCounts.Blocked
        }
    };


    successResponse(res, 200, "Dashboard stats fetched successfully", {
        totalProjects,
        totalEmployees,
        totalWorkHours: totalWorkHours[0]?.totalHours || 0,
        projectsByStatus
    });
});
