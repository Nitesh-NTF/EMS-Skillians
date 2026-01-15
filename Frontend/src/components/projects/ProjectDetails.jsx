import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { MultiTabs } from "../common/MultiTabs";
import { BackButton } from "../common/BackButton";
import {
  FullScreenLoader,
  PulseLoader,
  SkeletonLoader,
} from "../common/Loading";
import { ReactIcons } from "../constants/react_icons";
import { images } from "../constants/images";
import { getProject, toggleProjectStatus } from "../../service/project";
import { StatusModal } from "../common/StatusModal";
import { StatusBadge } from "../common/StatusBadge";

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

  const handleSetStatus = async () => {
    // setProject({ ...project, status: selectedStatus });

    setLoading(true);
    try {
      const res = await toggleProjectStatus(projectId, selectedStatus);
      setProject(res.data);
      toast.success(res.message);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }

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
                      <StatusBadge
                        status={project.status}
                        onClick={handleOpenModal}
                        isClickable={true}
                      />
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
                      {/* <button
                        onClick={handleOpenModal}
                        className="text-red-800 border border-red-800 hover:bg-red-800 hover:text-white transition py-1 px-6 w-fit"
                      >
                        Change Status
                      </button> */}
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
        statuses={["Start", "Pending", "In Progress", "Complete", "Blocked"]}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onSubmit={handleSetStatus}
      />
    </div>
  );
};
