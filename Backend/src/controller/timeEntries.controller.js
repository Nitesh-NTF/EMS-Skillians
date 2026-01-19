import { TimeEntry } from "../model/timeEntries.model.js";
import { ApiError, successResponse } from "../utils/cutomResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { Project } from "../model/project.model.js";

export const createTimeEntry = asyncHandler(async (req, res) => {
    const { project, startTime, endTime, employee } = req.body;

    // Calculate duration in hours
    const duration = parseFloat(((endTime - startTime) / (1000 * 60 * 60)).toFixed(2));

    if (duration <= 0) {
        throw new ApiError(400, "Time range should be minimum 1 minute.");
    }

    const timeEntry = await TimeEntry.create({
        project,
        duration,
        startTime,
        endTime,
        employee: employee || req.user._id
    })
    await Project.findByIdAndUpdate(project, { $inc: { duration: duration } },)

    const populatedEntry = await TimeEntry.findById(timeEntry._id)
        .populate('project', 'name')
        .populate('employee', 'name email');

    successResponse(res, 201, "Time entry created successfully.", populatedEntry);
});

export const getTimeEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ApiError(400, "Invalid time entry ID");

    const timeEntry = await TimeEntry.findById(id)
        .populate('project', 'name')
        .populate('employee', 'name email');

    if (!timeEntry) throw new ApiError(404, "Time entry not found");

    successResponse(res, 200, "Time entry fetched successfully", timeEntry);
});

export const getTimeEntries = asyncHandler(async (req, res) => {
    const { search, page, limit, project, employee, date } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" }
    if (project) filter.project = project;
    if (employee) filter.employee = employee;
    if (date) filter.date = date;

    const pageNum = page ? parseInt(page) : null;
    const limitNum = limit ? parseInt(limit) : null;

    let timeEntriesQuery = TimeEntry.find(filter)
        .populate('project', 'name')
        .populate('employee', 'name email')
        .sort({ createdAt: -1 });

    if (limitNum) {
        timeEntriesQuery = timeEntriesQuery.limit(limitNum);
        if (pageNum) timeEntriesQuery = timeEntriesQuery.skip((pageNum - 1) * limitNum);
    }

    const timeEntries = await timeEntriesQuery;

    const total = await TimeEntry.countDocuments(filter);

    const pagination = { total, page: pageNum || 1, limit: limitNum || total }
    successResponse(res, 200, "Time entries fetched successfully", {
        timeEntries,
        pagination
    });
});

export const updateTimeEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ApiError(400, "Invalid time entry ID");

    const updateData = { ...req.body };
    // Recalculate duration if startTime or endTime is updated
    if (updateData.startTime || updateData.endTime) {
        const entry = await TimeEntry.findById(id);
        if (!entry) throw new ApiError(404, "Time entry not found");

        const start = updateData.startTime || entry.startTime;
        const end = updateData.endTime || entry.endTime;

        if (end <= start) {
            throw new ApiError(400, "End time must be after start time");
        }
        const duration = parseFloat(((end - start) / (1000 * 60 * 60)).toFixed(2));
        updateData.duration = duration

        let projectDurationChange
        if (entry.duration > duration) {
            projectDurationChange = entry.duration - duration
            await Project.findByIdAndUpdate(updateData.project, { $inc: { duration: - projectDurationChange } },)
        } else if (entry.duration < duration) {
            projectDurationChange = duration - entry.duration
            await Project.findByIdAndUpdate(updateData.project, { $inc: { duration: projectDurationChange } },)
        }
    }

    const timeEntry = await TimeEntry.findByIdAndUpdate(id, updateData, { new: true })
        .populate('project', 'name')
        .populate('employee', 'name email');

    if (!timeEntry) throw new ApiError(404, "Time entry not found");

    successResponse(res, 200, "Time entry updated successfully", timeEntry);
});

export const deleteTimeEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ApiError(400, "Invalid time entry ID");

    const timeEntry = await TimeEntry.findByIdAndDelete(id);

    if (!timeEntry) throw new ApiError(404, "Time entry not found");

    successResponse(res, 200, "Time entry deleted successfully");
});