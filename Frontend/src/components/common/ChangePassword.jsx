import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RequiredSign } from "../common/RequiredSign";
import { changePassword } from "../../service/apis/employee";
import { useState } from "react";

export const ChangePassword = () => {
  const loggedUser = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await changePassword(loggedUser._id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-bold text-[#215675] mb-6">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        {/* Current Password */}
        <PasswordField
          label="Current Password"
          register={register("currentPassword", {
            required: "Current password is required",
          })}
          error={errors.currentPassword}
        />

        {/* New Password */}
        <PasswordField
          label="New Password"
          register={register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
          error={errors.newPassword}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm Password"
          register={register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === newPassword || "Passwords do not match",
          })}
          error={errors.confirmPassword}
        />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#215675] text-white px-6 py-2 rounded-sm disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

const PasswordField = ({ label, register, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">
      {label} <RequiredSign />
    </label>
    <input
      type="password"
      className="input"
      {...register}
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);
