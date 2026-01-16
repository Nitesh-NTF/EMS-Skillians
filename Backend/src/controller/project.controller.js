import { Project } from "../model/project.model.js"
import { Employee } from "../model/employee.model.js"
import { ApiError, successResponse } from "../utils/cutomResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
import { images } from "../constants/images.js"
import { uploadImage, deleteImage } from "../utils/cloudinary.js"
import { createProjectNotification } from "../utils/notificationService.js"

export const addProject = asyncHandler(async (req, res) => {
    const { name, category, client, estimatedHours, status, description, startDate, endDate, employees } = req.body

    if (!name || !category || !client || !estimatedHours || !status || !startDate || !endDate) {
        throw new ApiError(400, "All required fields must be provided.")
    }
    req.body.employees = employees ? employees.split(",") : []

    let file = req.body.icon || images.projectDefaultIcon
    if (req.file?.path || req.file?.filename) {
        const filePath = req.file?.path || req.file?.filename
        file = await uploadImage(filePath, "projects")
    }

    const project = await Project.create({ ...req.body, icon: file })

    // Add project to employees' projects array
    if (req.body.employees && req.body.employees.length > 0) {
        await Employee.updateMany(
            { _id: { $in: req.body.employees } },
            { $addToSet: { projects: project._id } }
        );
    }

    successResponse(res, 201, "Project created successfully.", project)
})

export const updateProject = asyncHandler(async (req, res) => {

    const { id } = req.params

    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid project Id")

    const project = await Project.findById(id)
    if (!project) throw new ApiError(400, "Project not exists")


    const { name, category, client, estimatedHours, status, description, startDate, endDate, employees } = req.body
    if (!name || !category || !client || !estimatedHours || !status || !startDate || !endDate) {
        throw new ApiError(400, "All required fields must be provided.")
    }
    req.body.employees = employees ? employees.split(",") : []

    let file = req.body.icon || images.projectDefaultIcon
    if (!req.body.icon && project.icon !== images.projectDefaultIcon) {
        await deleteImage(project.icon);
    }

    if (req.file?.path || req.file?.filename) {
        const filePath = req.file?.path || req.file?.filename
        const promiseArr = []
        const uploadImg = uploadImage(filePath, "projects")
        promiseArr.push(uploadImg)

        const [uploadedUrl] = await Promise.all(promiseArr)
        file = uploadedUrl
    }

    const updatedProject = await Project.findByIdAndUpdate(id, { ...req.body, icon: file }, { new: true })

    // Update employees' projects
    const oldEmployees = project.employees.map(emp => emp.toString());
    const newEmployees = req.body.employees || [];
    // console.log('oldEmployees', oldEmployees)
    // console.log('newEmployees', newEmployees)
    const toAdd = newEmployees.filter(emp => !oldEmployees.includes(emp));
    const toRemove = oldEmployees.filter(emp => !newEmployees.includes(emp));

    // console.log('toAdd', toAdd)
    // console.log('toRemove', toRemove)

    if (toAdd.length > 0) {
        const res = await Employee.updateMany(
            { _id: { $in: toAdd } },
            { $addToSet: { projects: id } }
        );
        // console.log('update emp project res: ', res)

        // 🔔 Trigger notification (non-blocking)
        try {
            await createProjectNotification({
                type: "PROJECT_EMPLOYEE_ADDED",
                projectId: id,
                projectName: updatedProject.name,
                affectedEmployeeIds: toAdd,
                triggeredBy: req.user._id,
                io: req.io
            });
        } catch (error) {
            console.error("Notification error:", error.message);
            // Don't break the API response
        }
    }

    if (toRemove.length > 0) {
        const res = await Employee.updateMany(
            { _id: { $in: toRemove } },
            { $pull: { projects: id } }
        );
        // console.log('remove emp project res: ', res)

        // 🔔 Trigger notification (non-blocking)
        try {
            await createProjectNotification({
                type: "PROJECT_EMPLOYEE_REMOVED",
                projectId: id,
                projectName: updatedProject.name,
                affectedEmployeeIds: toRemove,
                triggeredBy: req.user._id,
                io: req.io
            });
        } catch (error) {
            console.error("Notification error:", error.message);
            // Don't break the API response
        }
    }

    successResponse(res, 200, "Project updated successfully", updatedProject)
})

export const getProject = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid project Id")

    const project = await Project.findById(id)
    successResponse(res, 200, "Project fetch successfully", project)
})

export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid project Id")

    const project = await Project.findByIdAndDelete(id)
    if (project.icon !== images.projectDefaultIcon) {
        await deleteImage(project.icon);
    }

    // Remove project from employees' projects array
    await Employee.updateMany(
        { projects: id },
        { $pull: { projects: id } }
    );

    successResponse(res, 200, "Project delete successfully")
})


export const fetchProjects = asyncHandler(async (req, res) => {
    let { page, limit, search, status, employees } = req.query
    const pageNum = page ? parseInt(page) : null;
    const limitNum = limit ? parseInt(limit) : null;

    let query = {}
    if (search) query.name = { $regex: search, $options: "i" }
    if (status) query.status = status
    if (employees) {
        const empArr = employees.split(",")
        query.employees = { $in: empArr }
    }
    // else if (req.user?.role.includes("Employee") && req.user.role.length == 1) { query.employees = { $in: [req.user._id] } }

    let projects;
    if (limitNum && pageNum) {
        projects = await Project.find(query).populate("employees", "name email icon").limit(limitNum).skip((limitNum * pageNum) - limitNum).sort({ createdAt: -1 })
    } else {
        projects = await Project.find(query).populate("employees", "name email icon").sort({ createdAt: -1 })
    }
    const total = await Project.countDocuments(query)
    const pagination = { total, page: pageNum || 1, limit: limitNum || total }
    successResponse(res, 200, "Projects fetch successfully", { projects, pagination })
})

export const toggleProjectStatus = asyncHandler(async (req, res) => {
    const { id } = req.query
    const { status } = req.body

    if (!id) throw new ApiError(400, "Project ID is required")
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid project Id")
    if (!status) throw new ApiError(400, "Status is required")

    const validStatuses = ["Pending", "Start", "In Progress", "Blocked", "Complete"]
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Status must be one of: Pending, Active, Inactive, Complete")
    }

    const project = await Project.findById(id)
    if (!project) throw new ApiError(400, "Project not exists")

    const updatedProject = await Project.findByIdAndUpdate(id, { status }, { new: true })
    successResponse(res, 200, "Project status updated successfully", updatedProject)
})