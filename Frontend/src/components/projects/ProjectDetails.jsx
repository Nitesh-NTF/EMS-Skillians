import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../Button";
import { Img } from "../Img";
import { MultiTabs } from "../MultiTabs";
import { BackButton } from "../BackButton";
import { FullScreenLoader, PulseLoader, SkeletonLoader } from "../Loading";
import { ReactIcons } from "../constants/react_icons";
import { images } from "../constants/images";
import { getProject } from "../../service/project";

// const multiTabData = [
//   {
//     key: "1",
//     header: "Time Entries",
//     render: (tab) => (
//       <div>
//         <h1 className="text-[#535151] font-medium">Date Range</h1>
//         <ul>
//           <li className="w-full border border-gray-200 text-xs rounded-xs py-3 px-4 my-2 flex items-center gap-2 bg-white text-[#757575]">
//             <ReactIcons.SlCalender /> May 01 2025 - May 21 2025
//           </li>
//         </ul>
//       </div>
//     ),
//   },
//   { key: "2", header: "Employees", render: (tab) => <>tab content 2</> },
//   { key: "3", header: "Performance", render: (tab) => <>tab content 3</> },
//   { key: "4", header: "Settings", render: (tab) => <>tab content 4</> },
// ];

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  async function fetchProjectData() {
    setLoading(true);
    try {
      const res = await getProject(projectId);
      setProject(res.data);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleOpenModal = () => {
    setSelectedStatus(project?.status || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSetStatus = () => {
    setProject({ ...project, status: selectedStatus });
    toast.success("Status updated successfully");
    handleCloseModal();
  };

  return (
    <div>
      <BackButton
        path="/projects"
        btnName="Back To Projects"
        title="Project Details"
      />
      {/* profile */}
      <div className="my-5 py-2 bg-white text-[#646464] text-xs rounded-xs">
        {loading ? (
          <div>
            <SkeletonLoader />
          </div>
        ) : (
          project && (
            <>
              <h1 className="font-bold text-xl text-gray-800 text-center my-1">
                {project.name}
              </h1>
              <div className="flex py-2 gap-2">
                <div className="mx-3">
                  <div className="w-24 rounded-full overflow-hidden flex items-center justify-center m-auto">
                    <img className="w-full" src={project.icon} />
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 py-1">
                  <div className="flex flex-col gap-1">
                    <p>Client: {project.client}</p>
                    <p>Category: {project.category}</p>
                    <p>Project ID: {project._id}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>
                      Start:{" "}
                      <span className="font-bold"> {project.startDate}</span>
                    </p>
                    <p>
                      End: <span className="font-bold"> {project.endDate}</span>
                    </p>
                    <p>Estimated Hours: {project.estimatedHours}</p>
                    <p>Duration Hours: {project.duration}</p>
                  </div>
                  <div>
                    <div>
                      <span className="px-5 py-1 text-green-800 bg-[#C6F6D5] rounded-2xl w-fit">
                        {project.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() =>
                          navigate(`/projects/${project._id}/edit`)
                        }
                        className="text-white bg-[#4A6CF7] py-1 px-5 w-fit"
                      >
                        Edit Project
                      </button>
                      <button
                        onClick={handleOpenModal}
                        className="text-red-800 border border-red-800 hover:bg-red-800 hover:text-white transition py-1 px-6 w-fit"
                      >
                        Change Status
                      </button>
                    </div>
                  </div>
                  <div className="col-span-3 mt-2">
                    <p>
                      <span className="font-bold">Description: </span>{" "}
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>

      <MultiTabs
        tabName="projectId"
        path={`/projects/${projectId}/`}
        tabs={[
          {
            key: "workTimeEntries",
            header: "Work Time Entries",
            render: (tab) => (
              <>
                <Outlet />
              </>
            ),
          },
          {
            key: "employee",
            header: "Employees",
            render: (tab) => (
              <>
                <Outlet />
              </>
            ),
          },
          // { key: "3", header: "Performance", render: (tab) => <>tab content 3</> },
          // { key: "4", header: "Settings", render: (tab) => <>tab content 3</> },
        ]}
        className={{
          tHead: "text-xs",
          tHeaders: "p-2.5 text-center text-[#215675] font-semibold",
          activeTabHeader: "bg-[#215675] text-white",
          inactiveTabHeader: "bg-white",
        }}
      />

      <StatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onSubmit={handleSetStatus}
      />
    </div>
  );
};

const StatusModal = ({
  isOpen,
  onClose,
  selectedStatus,
  setSelectedStatus,
  onSubmit,
}) => {
  const statuses = ["Start", "Pending", "In Progress", "Complete", "Blocked"];

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={(e) => onSubmit(e)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
