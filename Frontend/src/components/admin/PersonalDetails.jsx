import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { images } from "../constants/images";
import { RequiredSign } from "../common/RequiredSign";
import { ButtonLoader, SkeletonLoader } from "../common/Loading";
import { updateEmployee, getEmployee } from "../../service/apis/employee";
import { useSelector } from "react-redux";
import { ChangePassword } from "../common/ChangePassword";

export const PersonalDetails = () => {
  const loggedUser = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const icon = watch("icon");
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
        icon: res.data.icon,
        department: res.data.department,
        status: res.data.status,
        role: res.data.role,
      });
      setImagePreview(res.data.icon);
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await updateEmployee({
        _id: loggedUser._id,
        ...data,
      });
      toast.success(res.message);
      setIsEditing(false);
      getCurrentUser();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // if (loading) return <SkeletonLoader />;

  return (
    <>
      {/* PERSONAL DETAILS CARD */}
      <div className="bg-white p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-[#215675]">
            Personal Details
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#215675] text-white px-4 py-2 rounded-sm text-sm"
            >
              Edit
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="flex justify-between">
            <div className="grid grid-cols-2 gap-6 text-sm flex-1">
              <Detail label="Name" value={currentUser?.name} />
              <Detail label="Email" value={currentUser?.email} />
              <Detail label="Department" value={currentUser?.department} />
              <Detail label="Status" value={currentUser?.status} />
              <Detail label="Role" value={currentUser?.role?.join(", ")} />
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
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
            {/* Profile Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Profile Image
              </label>

              <input
                type="file"
                hidden
                id="icon"
                accept="image/*"
                {...register("icon")}
                onChange={handleImageChange}
              />

              <div className="flex items-center gap-4">
                <img
                  src={imagePreview || images.defalutImage}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border"
                />

                <label
                  htmlFor="icon"
                  className="bg-[#215675] text-white px-4 py-2 text-sm rounded-sm cursor-pointer"
                >
                  Upload
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setValue("icon", "");
                    setImagePreview(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 text-sm rounded-sm"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Name <RequiredSign />
              </label>
              <input
                className="input"
                {...register("name", { required: "Name is required" })}
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Email <RequiredSign />
              </label>
              <input
                type="email"
                className="input"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#215675] text-white px-6 py-2 rounded-sm"
              >
                {loading ? <ButtonLoader /> : "Update"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* CHANGE PASSWORD CARD */}
      <ChangePassword />
    </>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="font-semibold text-gray-700">{label}:</p>
    <p className="text-[#666666]">{value || "N/A"}</p>
  </div>
);
