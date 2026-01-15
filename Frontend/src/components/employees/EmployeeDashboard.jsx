import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { BackButton } from "../BackButton";
import { Card } from "../Card";
import { FullScreenLoader } from "../Loading";
import { WorkTImeEntries } from "../time_entries/WorkTImeEntries";
import { fetchTimeEntries, addTimeEntry } from "../../service/timeEntries";
import { fetchProjects } from "../../service/project";
import { getTime } from "../../utils/helpingFns";

export const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const loggedUser = useSelector((state) => state.auth.user);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentProject, setCurrentProject] = useState(() => {
    const data = JSON.parse(
      localStorage.getItem(`ActiveTimeEntry-${loggedUser._id}`)
    );
    if (!data || Object.keys(data).length === 0) {
      return null; // no active project
    }
    const [projectId] = Object.entries(data)[0];
    return projectId;
  });

  const [activeTimeEntries, setActiveTimeEntries] = useState(() => {
    const stored = localStorage.getItem(`ActiveTimeEntry-${loggedUser._id}`);
    return stored ? JSON.parse(stored) : {};
  });
  const activeEntry = activeTimeEntries[currentProject];
  const startTime = activeEntry && activeEntry.startTime;
  const endTime = activeEntry && activeEntry.endTime;

  function handleStartStop() {
    if (activeTimeEntries[currentProject]) {
      // stop
      const entry = activeTimeEntries[currentProject];
      const endTime = Date.now();
      const data = {
        project: currentProject,
        startTime: entry.startTime,
        endTime: endTime,
        // Assuming employee is from auth, but for now, add if needed
      };
      addTimeEntry(data)
        .then(() => {
          setActiveTimeEntries((prev) => {
            const newEntries = { ...prev };
            delete newEntries[currentProject];
            return newEntries;
          });
          setReloadKey((prev) => prev + 1);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || error.message);
        });
    } else {
      // start
      setActiveTimeEntries((prev) => ({
        ...prev,
        [currentProject]: {
          startTime: Date.now(),
          endTime: null,
        },
      }));
    }
  }

  const fetchProjectsFn = useCallback(async () => {
    try {
      const res = await fetchProjects({ employees: loggedUser._id });
      setProjects(res.data.projects);
      if (!currentProject) {
        setCurrentProject(res.data.projects[0]._id);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsFn();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      `ActiveTimeEntry-${loggedUser._id}`,
      JSON.stringify(activeTimeEntries)
    );
  }, [activeTimeEntries]);

  return (
    <div>
      <BackButton
        title="Employee Dashboard"
        caption={new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(Date.now())}
      />{" "}
      <div className="my-5 mb-10">
        {loading && <FullScreenLoader />}

        <Card className="p-5 my-5">
          <div className="flex items-center">
            <div className="text-[#51515B] flex items-center justify-between w-full">
              <select
                className="input py-2 px-5 w-full mx-4"
                name="project"
                id="project"
                value={currentProject || ""}
                onChange={(e) => setCurrentProject(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <div>
                <span className="input py-2 px-5 w-fit mx-4 text-nowrap">
                  {startTime ? getTime(startTime) : "Start Time"}
                </span>
                to
                <span className="input py-2 px-5 w-fit mx-4 text-nowrap">
                  {startTime ? getTime(Date.now()) : "End Time"}
                </span>
              </div>
              <button
                className="input py-1.5 px-5 w-fit mx-4 bg-[#D50000] text-white"
                onClick={handleStartStop}
              >
                {activeEntry ? "Stop" : "Start"}
              </button>
            </div>
          </div>
        </Card>

        <h1 className="text-base mb-4 text-center">Work Time Entries</h1>
        <WorkTImeEntries key={reloadKey} isLoggedUser={true} />
      </div>
    </div>
  );
};
