import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import toast from "react-hot-toast";
import { BackButton } from "../BackButton";
import { RequiredSign } from "../RequiredSign";
import { FullScreenLoader } from "../Loading";
import { images } from "../constants/images";
import { addProject, updateProject, getProject } from "../../service/project";
import { fetchEmployees } from "../../service/employee";

const initialState = {
  name: "",
  category: "",
  client: "",
  duration: 0,
  estimatedHours: 0,
  status: "Active",
  description: "",
  startDate: "",
  endDate: "",
  progressStatus: "In Progress",
  progresssPercentage: 0,
  icon: "",
  employees: [],
};

export const AddProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
  });
  const icon = watch("icon");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    setValue("icon", file);
  };

  async function onSubmit(data) {
    setLoading(true);
    console.log("data", data);
    try {
      if (!projectId) {
        delete data._id;
        const res = await addProject(data);
        console.log("res", res.data);
        toast.success(res.message);
        reset();
        navigate("/projects");
      } else {
        const res = await updateProject({
          ...data,
          _id: projectId,
        });
        console.log("res", res.data);
        toast.success(res.message);
        navigate("/projects");
      }
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function getEditData() {
    setLoading(true);
    try {
      const res = await getProject(projectId);
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

  async function fetchEmp() {
    setLoading(true);
    try {
      const res = await fetchEmployees();
      setEmployees(res.data.employees);
    } catch (error) {
      console.log("err: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmp();
    if (projectId) {
      console.log("projectId", projectId);
      getEditData();
    }
  }, [projectId]);

  return (
    <div>
      {loading && <FullScreenLoader />}
      <BackButton
        btnName="Back To Projects"
        title={projectId ? "Edit Project" : "Add New Project"}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-4 w-4/5 grid grid-cols-2 gap-y-5 gap-x-5 text-[#535151]"
      >
        <div>
          <label>
            Project Name <RequiredSign />
            <input
              className="input"
              {...register("name", {
                required: "Project name is required",
              })}
            />
          </label>
          {errors.name && (
            <p className="text-orange-500 text-[10px]">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label>
            Project Type <RequiredSign />
            <select
              className="input"
              {...register("category", {
                required: "Project type is required",
              })}
            >
              {[
                { key: "1", value: "Web Portal" },
                { key: "2", value: "API Server" },
                { key: "3", value: "Connection Service" },
              ].map((opt) => (
                <option key={opt.key} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>
          </label>
          {errors.category && (
            <p className="text-orange-500 text-[10px]">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label>
            Client Name <RequiredSign />
            <input
              className="input"
              {...register("client", {
                required: "Client name is required",
              })}
            />
          </label>
          {errors.client && (
            <p className="text-orange-500 text-[10px]">
              {errors.client.message}
            </p>
          )}
        </div>
        <div>
          <label>
            Status <RequiredSign />
            <select
              className="input"
              {...register("status", {
                required: "Status is required",
              })}
            >
              {[
                { key: "pending", value: "Pending" },
                { key: "active", value: "Active" },
                { key: "inactive", value: "Inactive" },
                { key: "complete", value: "Complete" },
              ].map((opt) => (
                <option key={opt.key} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>
          </label>
          {errors.status && (
            <p className="text-orange-500 text-[10px]">
              {errors.status.message}
            </p>
          )}
        </div>
        <label htmlFor="description" className="col-span-2">
          Project Description <br />
          <textarea
            className="input text-xs h-20"
            placeholder="Enter Project description..."
            {...register("description")}
          ></textarea>
        </label>
        <div>
          <label>
            Start Date <RequiredSign />
            <input
              className="input"
              type="date"
              {...register("startDate", {
                required: "Start date is required",
              })}
            />
          </label>
          {errors.startDate && (
            <p className="text-orange-500 text-[10px]">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label>
            End Date <RequiredSign />
            <input
              className="input"
              type="date"
              {...register("endDate", {
                required: "End date is required",
              })}
            />
          </label>
          {errors.endDate && (
            <p className="text-orange-500 text-[10px]">
              {errors.endDate.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label>
            Estimated Hours <RequiredSign />
            <input
              className="input"
              type="number"
              {...register("estimatedHours", {
                required: "Estimated hours is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
          </label>
          {errors.estimatedHours && (
            <p className="text-orange-500 text-[10px]">
              {errors.estimatedHours.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label>
            Team Members <RequiredSign />
            <Controller
              name="employees"
              control={control}
              defaultValue={[]} // IMPORTANT
              render={({ field }) => (
                <ReactSelect
                  isMulti
                  isSearchable
                  placeholder="Select team members"
                  options={employees.map((emp) => ({
                    value: emp._id,
                    label: emp.name,
                  }))}
                  // Convert IDs → react-select format (for display)
                  value={employees
                    .filter((emp) => field.value?.includes(emp._id))
                    .map((emp) => ({
                      value: emp._id,
                      label: emp.name,
                    }))}
                  // Convert react-select options → IDs only
                  onChange={(selected) =>
                    field.onChange(
                      selected ? selected.map((option) => option.value) : []
                    )
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "1px solid #d1d5db",
                      borderRadius: "0.25rem",
                      padding: "0.25rem",
                      fontSize: "0.875rem",
                      minHeight: "2.5rem",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#9ca3af",
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "#e5e7eb",
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: "#374151",
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: "#6b7280",
                      ":hover": {
                        backgroundColor: "#d1d5db",
                        color: "#374151",
                      },
                    }),
                  }}
                />
              )}
            />
          </label>
          {errors.employees && (
            <p className="text-orange-500 text-[10px]">
              {errors.employees.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label>Project Image</label>
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

        <span className="w-fit col-span-2">
          <input
            type="submit"
            value={projectId ? "Update Project" : "Create Project"}
            className="py-2 px-3 mr-5 bg-[#215675] text-white rounded-sm "
          />
          {!projectId && (
            <input
              type="reset"
              value="Reset"
              className="py-2 px-3 bg-white border border-gray-300 rounded-sm "
            />
          )}
        </span>
      </form>
    </div>
  );
};
