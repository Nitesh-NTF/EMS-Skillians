import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { images } from "../constants/images";
import { RequiredSign } from "../common/RequiredSign";
import { FullScreenLoader } from "../common/Loading";
import { updateEmployee, getEmployee } from "../../service/apis/employee";
import { useSelector } from "react-redux";

export const PersonalDetails = () => {
  const loggedUser = useSelector((state) => state.auth.user);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const icon = watch("icon");
  const password = watch("password");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("icon", file);
    }
  };

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await getEmployee(loggedUser._id);
      setCurrentUser(res.data);
      reset({
        name: res.data.name,
        email: res.data.email,
        department: res.data.department,
        status: res.data.status,
        role: res.data.role,
      });
      setImagePreview(res.data.icon);
    } catch (error) {
      console.log("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const updateData = {
        ...data,
        _id: loggedUser._id,
      };

      const res = await updateEmployee(updateData);
      toast.success(res.message);
      setIsEditing(false);
      getCurrentUser(); // Refresh user data
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (!isEditing) {
    return (
      <div className="bg-white p-6">
        {loading && <FullScreenLoader />}

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-[#215675]">
            Personal Details
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#215675] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#1a4660]"
          >
            Edit Profile
          </button>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Name:</p>
                <p className="text-[#666666]">{currentUser?.name || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Email:</p>
                <p className="text-[#666666]">{currentUser?.email || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Department:</p>
                <p className="text-[#666666]">
                  {currentUser?.department || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Status:</p>
                <p className="text-[#666666]">{currentUser?.status || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Role:</p>
                <p className="text-[#666666]">
                  {currentUser?.role?.join(", ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 ml-8">
            <img
              src={currentUser?.icon || images.defalutImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#215675]"
            />
            <strong className="text-[#215675]">{currentUser?.name}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      {loading && <FullScreenLoader />}

      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold text-[#215675]">
          Edit Personal Details
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        {/* Profile Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Profile Image
          </label>
          <input
            className="hidden"
            type="file"
            id="icon"
            accept="image/*"
            {...register("icon")}
            onChange={handleImageChange}
          />
          <div className="flex items-center gap-4">
            <img
              src={imagePreview || images.defalutImage}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <div>
              <label
                htmlFor="icon"
                className="bg-blue-500 text-white py-2 px-4 text-sm rounded-sm cursor-pointer hover:bg-blue-600"
              >
                Upload
              </label>
              <button
                type="button"
                onClick={() => {
                  setValue("icon", "");
                  setImagePreview(null);
                }}
                className="bg-red-500 text-white py-2 px-4 ml-2 text-sm rounded-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Name <RequiredSign />
          </label>
          <input
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#215675]"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email <RequiredSign />
          </label>
          <input
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#215675]"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#215675]"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Leave blank to keep current password
          </p>
        </div>

        {/* Confirm Password */}
        {password && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Confirm Password <RequiredSign />
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#215675]"
              {...register("confirmPassword", {
                required: password ? "Please confirm your password" : false,
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-[#215675] text-white px-6 py-2 rounded-sm hover:bg-[#1a4660] transition-colors"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded-sm hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
