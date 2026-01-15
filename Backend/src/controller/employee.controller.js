import bcrypt from "bcrypt"
import { Employee } from "../model/employee.model.js"
import { ApiError, successResponse } from "../utils/cutomResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
import { images } from "../constants/images.js"
import { deleteImage, uploadImage } from "../utils/cloudinary.js"

export const addEmployee = asyncHandler(async (req, res) => {
    const { name, email, password, department, status, icon, role } = req.body

    if (!name || !email) throw new ApiError(400, "Name and email are required.")

    const exist = await Employee.findOne({ email })
    if (exist) throw new ApiError(500, "Email already exists.")

    const hashedPassword = await bcrypt.hash(password, 10)

    let file = icon || images.userDefaultAvatar
    if (req.file?.path || req.file?.filename) {
        const filePath = req.file?.path || req.file?.filename
        file = await uploadImage(filePath, "employees")
    }

    const employee = await Employee.create({ name, email, password: hashedPassword, department, status, icon: file, role: role ? role.split(",") : [] })
    successResponse(res, 201, "Employee created successsfully.", employee)
})

export const getEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid employee Id")

    const employee = await Employee.findById(id).select("-password")
    successResponse(res, 200, "Employee fetch successfully", employee)
})

export const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid employee Id")

    const employee = await Employee.findByIdAndDelete(id).select("-password")
    if (employee.icon !== images.userDefaultAvatar) {
        await deleteImage(employee.icon);
    }

    successResponse(res, 200, "Employee delete successfully")
})

export const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid employee Id")

    const employee = await Employee.findById(id)
    if (!employee) throw new ApiError(400, "Employee not exists")

    const { name, email, department, status, icon, role } = req.body

    req.body.role = role ? role.split(",") : []

    let file = icon || images.userDefaultAvatar
    if (!icon && employee.icon !== images.userDefaultAvatar) {
        await deleteImage(employee.icon);
    }

    if (req.file?.path || req.file?.filename) {
        const filePath = req.file?.path || req.file?.filename
        const promiseArr = []
        const uploadImg = uploadImage(filePath, "employees")
        promiseArr.push(uploadImg)

        const [uploadedUrl] = await Promise.all(promiseArr)
        file = uploadedUrl
    }
    console.log('req.body', req.body)
    const updatedEmployee = await Employee.findByIdAndUpdate(id, { name, email, department, status, icon: file, role: req.body.role }, { new: true }).select("-password")
    successResponse(res, 200, "Employee updated successfully", updatedEmployee)
})

export const fetchEmployees = asyncHandler(async (req, res) => {
    let { page, limit, search, role, department, project } = req.query
    const pageNum = page ? parseInt(page) : null;
    const limitNum = limit ? parseInt(limit) : null;

    let query = {}
    if (search) query.name = { $regex: search, $options: "i" }
    if (role) {
        const roleArray = Array.isArray(role) ? role : role.split(',').map(r => r.trim())
        query.role = { $all: roleArray, $size: roleArray.length }
    }
    if (department) query.department = department
    if (project) {
        const projectArr = project.split(",")
        query.projects = { $in: projectArr }
    }

    let employees;
    if (limitNum && pageNum) {
        employees = await Employee.find(query).limit(limitNum).skip((limitNum * pageNum) - limitNum).sort({ createdAt: -1 })
    } else {
        employees = await Employee.find(query).sort({ createdAt: -1 })
    }
    const total = await Employee.countDocuments(query)
    const pagination = { total, page: pageNum || 1, limit: limitNum || total }
    successResponse(res, 200, "Employees fetch successfully", { employees, pagination })
})