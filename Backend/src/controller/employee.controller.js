import bcrypt from "bcrypt"
import { Employee } from "../model/employee.model.js"
import { ApiError, successResponse } from "../utils/cutomResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
import { images } from "../constants/images.js"
import { deleteImage, uploadImage } from "../utils/cloudinary.js"
import { EMPLOYEE_FIELDS } from "../constants/employeeFields.js"

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
    const { display = 'DETAIL' } = req.query
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid employee Id")

    const fields = EMPLOYEE_FIELDS[display.toUpperCase()] || EMPLOYEE_FIELDS.DETAIL
    const employee = await Employee.findById(id).select(fields)
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
    // console.log('req.body', req.body)
    const updatedEmployee = await Employee.findByIdAndUpdate(id, { name, email, department, status, icon: file, role: req.body.role }, { new: true }).select("-password")
    successResponse(res, 200, "Employee updated successfully", updatedEmployee)
})

export const fetchEmployees = asyncHandler(async (req, res) => {
    let { page, limit, search, role, department, project, display = 'LIST' } = req.query
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

    const fields = EMPLOYEE_FIELDS[display.toUpperCase()] || EMPLOYEE_FIELDS.LIST

    let employees;
    if (limitNum && pageNum) {
        employees = await Employee.find(query).select(fields).limit(limitNum).skip((limitNum * pageNum) - limitNum).sort({ createdAt: -1 })
    } else {
        employees = await Employee.find(query).select(fields).sort({ createdAt: -1 })
    }
    const total = await Employee.countDocuments(query)
    const pagination = { total, page: pageNum || 1, limit: limitNum || total }
    successResponse(res, 200, "Employees fetch successfully", { employees, pagination })
})

export const toggleEmployeeStatus = asyncHandler(async (req, res) => {
    const { id, display = 'LIST' } = req.query
    const { status } = req.body

    if (!id) throw new ApiError(400, "Employee ID is required")
    if (!isValidObjectId(id)) throw new ApiError(400, "Pass valid employee Id")
    if (!status) throw new ApiError(400, "Status is required")

    const validStatuses = ["Active", "Inactive"]
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Status must be Active or Inactive")
    }

    const employee = await Employee.findById(id)
    if (!employee) throw new ApiError(400, "Employee not exists")

    const fields = EMPLOYEE_FIELDS[display.toUpperCase()] || EMPLOYEE_FIELDS.LIST
    const updatedEmployee = await Employee.findByIdAndUpdate(id, { status }, { new: true }).select(fields)
    successResponse(res, 200, "Employee status updated successfully", updatedEmployee)
})

export const changePassword = asyncHandler(async (req, res) => {
    const id = req.user._id
    console.log('id', id)
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) throw new ApiError(400, "Current password and new password are required")
    if (newPassword.length < 6) throw new ApiError(400, "New password must be at least 6 characters long")

    const user = await Employee.findById(id).select("+password")
    if (!user) throw new ApiError(404, "User not found")

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordCorrect) throw new ApiError(400, "Current password is incorrect")

    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) throw new ApiError(400, "New password cannot be same as old password")

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    successResponse(res, 200, "Password changed successfully")
})
