import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../Button";
import { Img } from "../Img";
import { MultiTabs } from "../MultiTabs";
import { BackButton } from "../BackButton";
import { Table } from "../Table";
import { AvatarGroup } from "../AvatarGroup";
import { FullScreenLoader, PulseLoader, SkeletonLoader } from "../Loading";
import { WorkTImeEntries } from "../time_entries/WorkTImeEntries";
import { ManageProjects } from "../projects/Projects";
import { ReactIcons } from "../constants/react_icons";
import { images } from "../constants/images";
import { getEmployee } from "../../service/employee";
import { fetchTimeEntries } from "../../service/timeEntries";
import { fetchProjects } from "../../service/project";
import { getToday } from "../../utils/helpingFns";

const ProjectCol = [
  {
    key: "name",
    header: "Project",
    render: (row, index) => (
      <div className="w-full text-left flex items-center">
        {" "}
        <span
          className={`mx-2 py-1 rounded-xs flex items center`}
          // style={{ backgroundColor: row.color }}
        >
          {index + 1} <img src={row.icon} alt="icon" className="w-5 h-5 ml-2" />
        </span>{" "}
        {row.name}
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => <>{getToday(row.createdAt)}</>,
  },
  {
    key: "startTime",
    header: "Start Time",
    render: (row) => <>{getTime(row.startTime)}</>,
  },
  {
    key: "endTime",
    header: "End Time",
    render: (row) => <>{getTime(row.endTime)}</>,
  },
  {
    key: "duration",
    header: "Duration",
    render: (row) => <>{row.duration}</>,
  },
];

// const multiTabData =
export const EmployeeDetail = () => {
  const { empId } = useParams();
  const [user, setUser] = useState(null);
  // const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState({ user: true, project: false });

  async function fetchUserData() {
    try {
      const res = await getEmployee(empId);
      setUser(res.data);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  }

  const fetchProjectsFn = useCallback(async () => {
    try {
      const res = await fetchProjects({ employees: [empId] });
      console.log("res.data projects", res.data);
      setProjects(res.data.projects);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, project: false }));
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    // fetchProjectsFn();
  }, [empId]);

  return (
    <div>
      <BackButton
        path="/employees"
        btnName="Back To Employees"
        title="Employee Details"
      />
      {/* profile */}
      <div className="grid grid-cols-2 items-center my-5 bg-white text-[#646464] text-xs rounded-xs">
        {loading.user ? (
          <div className="col-span-2">
            <SkeletonLoader />
          </div>
        ) : (
          user && (
            <>
              <div className="flex m-10 gap-10">
                <div>
                  <div className="w-24 rounded-full overflow-hidden flex items-center justify-center">
                    <img className="w-full" src={user.icon} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl text-[#215675] mb-2">{user.name}</h2>
                  <p className="mb-1.5">{user.email}</p>
                  <p className="mb-1.5">{user.department}</p>
                  <p className="mb-1.5">Employee ID: {user._id}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="px-5 py-1 text-green-800 bg-[#C6F6D5] rounded-2xl mr-2 w-fit">
                  {user.status}
                </span>
                <div>
                  <button
                    onClick={() => navigate(`/employees/${user._id}/edit`)}
                    className="text-white bg-[#4A6CF7] py-1 px-6 mr-5"
                  >
                    Edit Profile
                  </button>
                  <button className="text-red-800 border border-red-800 py-1 px-6 ">
                    Deactivate
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>

      <MultiTabs
        tabName="empId"
        path={`/employees/${empId}/`}
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
            key: "project",
            header: "Project",
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
    </div>
  );
};
