import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BackButton } from "../common/BackButton";
import { RequiredSign } from "../common/RequiredSign";
import { FullScreenLoader } from "../common/Loading";
import { images } from "../constants/images";
import {
  addEmployee,
  getEmployee,
  updateEmployee,
} from "../../service/employee";

const initialState = {
  name: "",
  email: "",
  password: "",
  department: "",
  role: [],
  status: "",
  icon: "",
};

export const AddEmployee = () => {
  const { empId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
  });
  const icon = watch("icon");
  const password = watch("password");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    setValue("icon", file);
  };

  async function onsubmit(data) {
    setLoading(true);
    console.log("data", data);
    try {
      if (!empId) {
        delete data._id;
        const res = await addEmployee(data);
        console.log("res", res.data);
        toast.success(res.message);
        reset();
        navigate("/employees");
      } else {
        const res = await updateEmployee({
          ...data,
          _id: empId,
        });
        console.log("res", res.data);
        toast.success(res.message);
        navigate(`/employees/${empId}/workTimeEntries`);
      }
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function getEditData() {
    try {
      setLoading(true);
      const res = await getEmployee(empId);
      console.log("res", res.data);
      reset(res.data);
      setImagePreview(res.data?.icon);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response.data?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (empId) {
      console.log("empId", empId);
      getEditData();
    }
  }, [empId]);

  return (
    <div>
      {loading && <FullScreenLoader />}
      <BackButton
        btnName="Back To Employees"
        title={`${empId ? "Edit" : "Add"} Employee`}
      />
      <form onSubmit={handleSubmit(onsubmit)} className="py-4 w-2/3">
        {/* Username */}
        <div className="mb-4">
          <label>
            Username <RequiredSign />
            <input
              className="input"
              {...register("name", {
                required: "Name is required",
              })}
            />
          </label>
          {errors.name && (
            <p className="text-orange-500 text-[10px]">{errors.name.message}</p>
          )}
          <p className="text-[#666666] text-xs">
            Spaces are allowed; punctuation is not allowed except for periods,
            hyphens, apostrophes, and underscores make it correct
          </p>
        </div>
        {/* Email */}
        <div className="mb-4">
          <label>
            Email <RequiredSign />
            <input
              className="input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email",
                },
              })}
            />
          </label>
          {errors.email && (
            <p className="text-orange-500 text-[10px]">
              {errors.email.message}
            </p>
          )}
          <p className="text-[#666666] text-xs">
            A valid e-mail address. All e-mails from the system will be sent to
            this address. The e-mail address is not made public and will only be
            used if you wish to receive a new password or wish to receive
            certain news or notifications by e-mail.
          </p>
        </div>
        {!empId && (
          <>
            {/* Password */}
            <div className="mb-4">
              <label>
                Password
                <input
                  className="input"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-orange-500 text-[10px]">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-[#666666] text-xs">
                  Spaces are allowed; punctuation is not allowed except for
                  periods, hyphens, apostrophes, and underscores make it correct
                </p>
              </label>
            </div>
            {/* Confrim Password */}
            <div className="mb-4">
              <label>
                Confirm Password
                <input
                  className="input"
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-orange-500 text-[10px]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </label>
              <p className="text-[#666666] text-xs">
                Provide a password for the new account in both fields.
              </p>
            </div>
          </>
        )}
        {/* Status */}
        <div className="mb-4 text-xs">
          <span className="text-base">Status</span>
          <br />
          <label className="text-[#666666] flex my-1 items-center gap-1.5">
            <input
              type="radio"
              value="Active"
              {...register("status", { required: "Status is required" })}
            />
            Active
          </label>
          <label className="text-[#666666] flex my-1 items-center gap-1.5">
            <input type="radio" value="Inactive" {...register("status")} />
            Inactive
          </label>
          {errors.status && (
            <p className="text-orange-500 text-[10px]">
              {errors.status.message}
            </p>
          )}
        </div>{" "}
        {/* Department */}
        <div className="mb-4 text-xs">
          <span className="text-base">Department</span>
          <br />
          {["Development", "UI/UX", "Bubble"].map((dept, index) => (
            <label
              key={index}
              className="text-[#666666] flex my-1 items-center gap-1.5"
            >
              <input
                type="radio"
                value={dept}
                {...register("department", {
                  required: "Department is required",
                })}
              />
              {dept}
            </label>
          ))}

          {errors.department && (
            <p className="text-orange-500 text-[10px]">
              {errors.department.message}
            </p>
          )}
        </div>
        {/* Role */}
        <div className="mb-4 text-xs">
          <span className="text-base">Role</span>
          {["Admin", "Employee"].map((role) => (
            <label
              key={role}
              className="text-[#666666] my-1 flex items-center gap-1.5"
            >
              <input
                type="checkbox"
                value={role}
                {...register("role", {
                  required: "At least one role required",
                })}
              />
              {role}
            </label>
          ))}
          {errors.role && (
            <p className="text-orange-500 text-[10px]">{errors.role.message}</p>
          )}
        </div>
        {/* Icon */}
        <div className="col-span-2">
          <label>Profile Image</label>
          <br />
          <input
            className="hidden"
            type="file"
            id="icon"
            accept="image/*"
            {...register("icon")}
            onChange={handleImageChange}
          />
          <div className="w-40 mt-2">
            <img
              src={imagePreview || images.defalutImage}
              alt="Preview"
              className="w-full rounded-sm"
            />
          </div>
          <div>
            <label
              htmlFor="icon"
              className="bg-blue-500 text-white py-0.5 px-2 m-3 text-xs rounded-sm"
            >
              Upload
            </label>
            <button
              type="button"
              onClick={() => {
                setValue("icon", "");
                setImagePreview(null);
              }}
              className="bg-red-500 text-white py-0.5 px-2 m-3 text-xs rounded-sm"
            >
              Delete
            </button>
          </div>
          {errors.icon && (
            <p className="text-orange-500 text-[10px]">{errors.icon.message}</p>
          )}
        </div>
        {/* Submit */}
        <input
          type="submit"
          value={`${empId ? "Edit" : "Create New"} Account`}
          className="py-2 px-7 rounded-sm bg-[#215675] text-white cursor-pointer"
        />
      </form>
    </div>
  );
};
