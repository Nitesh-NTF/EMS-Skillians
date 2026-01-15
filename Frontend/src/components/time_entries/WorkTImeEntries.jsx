import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../common/Card";
import { Table } from "../common/Table";
import { FullScreenLoader } from "../common/Loading";
import { Pagination } from "../common/Pagination";
import { ReactIcons } from "../constants/react_icons";
import { fetchProjects } from "../../service/project";
import { fetchTimeEntries, addTimeEntry } from "../../service/timeEntries";
import { getTime, getToday } from "../../utils/helpingFns";

export const WorkTImeEntries = ({ isLoggedUser = false }) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const timerRef = useRef();
  const { empId, projectId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({ search: "" });
  const [loading, setLoading] = useState({ project: true, table: true });
  const loggedUser = useSelector((state) => state.auth.user);
  const employee = (isLoggedUser && loggedUser._id) || empId;

  function handleSearch(e) {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  }

  const fetchTimeEntriesFn = useCallback(async () => {
    try {
      const res = await fetchTimeEntries({
        ...query,
        page,
        limit,
        ...(employee ? { employee } : {}),
        ...(projectId ? { project: projectId } : {}),
      });
      setTimeEntries(res.data.timeEntries);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  }, [query, page, limit]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, table: true }));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchTimeEntriesFn(), 1000);
  }, [fetchTimeEntriesFn]);

  return (
    <div>
      <div className="bg-[#EEEEF0] rounded-2xl flex items-center px-7 mb-2">
        <ReactIcons.IoSearchSharp className="text-[#7a7c8f] text-xl" />
        <input
          type="search"
          name="search"
          value={query.search}
          onChange={handleSearch}
          className="w-full rounded-2xl px-3 py-2"
          placeholder="Search projects"
        />
      </div>

      <Table
        data={timeEntries}
        keyField="_id"
        // path="/workEntry"
        loading={loading.table}
        className={{
          table: "w-full",
          // thead: "bg-gray-100",
          tbody: "",
          tr: "hover:bg-gray-50 text-[#51515B] bg-white border-b border-gray-300",
          th: "px-4 py-2 text-center text-[#215675] border-b border-gray-300",
          td: "px-4 py-3",
        }}
        coloums={[
          {
            key: "date",
            header: "DATE",
            render: (row) => <>{getToday(row.createdAt)}</>,
          },
          projectId
            ? {
                key: "employee",
                header: "EMPLOYEE",
                render: (row) => <>{row.employee.name}</>,
              }
            : {
                key: "project",
                header: "PROJECT",
                render: (row) => <>{row.project.name}</>,
              },
          {
            key: "timeRange",
            header: "TIME RANGE",
            render: (row) => (
              <>
                {getTime(row.startTime)} - {getTime(row.endTime)}
              </>
            ),
          },
          {
            key: "duration",
            header: "DURATION (HOURS)",
            render: (row) => <>{row.duration}</>,
          },
          loggedUser.role.includes("Admin") && {
            key: "actions",
            header: "ACTIONS",
            render: (row) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/workEntry/${row._id}/edit`);
                }}
                className="px-3 py-1 text-green-800 bg-slate-300 rounded-md mr-2 cursor-pointer"
              >
                Edit
              </button>
            ),
          },
        ].filter(Boolean)}
      />
      {timeEntries.length > 0 && (
        <Pagination
          limit={limit}
          page={page}
          total={total}
          changePage={setPage}
        />
      )}
    </div>
  );
};
