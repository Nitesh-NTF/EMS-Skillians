import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../common/BackButton";
import { Table } from "../common/Table";
import { AvatarGroup } from "../common/AvatarGroup";
import { Pagination } from "../common/Pagination";
import { SearchBar } from "../common/SearchBar";
import { ReactIcons } from "../constants/react_icons";
import { deleteProject, fetchProjects } from "../../service/project";
import { StatusBadge } from "../common/StatusBadge";

export const ManageProjects = ({
  search = false,
  status = false,
  addBtn = false,
  title = false,
  pagination = false,
  actions = false,
}) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    search: "",
    status: "",
  });
  const [loading, setLoading] = useState({ project: true });
  const timerRef = useRef();
  const { empId } = useParams();
  const loggedUser = useSelector((state) => state.auth.user);

  function handleSearch(e) {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  }

  async function handleDelete(id) {
    setLoading((prev) => ({ ...prev, project: true }));
    try {
      const res = await deleteProject(id);
      toast.success(res.message);
      fetchData();
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, project: false }));
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchProjects({
        ...query,
        ...(pagination && { page, limit }),
        ...(empId && { employees: [empId] }),
      });
      console.log("res.data", res.data);
      setProjects(res.data.projects);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, project: false }));
    }
  }, [query, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [query, limit]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, project: true }));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchData(), 1000);
  }, [query, fetchData]);

  return (
    <div>
      {/* title */}
      {title && <BackButton title="Project Management" />}

      <div className="text-gray-600 flex items-center gap-8 my-4">
        {/* search */}
        {search && (
          <SearchBar
            placeholder="Search Projects..."
            value={query.search}
            onChange={handleSearch}
          />
        )}

        {/* status filter */}
        {status && (
          <select className="input" name="status" onChange={handleSearch}>
            <option value="">All Status</option>
            {["Start", "Pending", "In Progress", "Complete", "Blocked"].map(
              (dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              )
            )}
          </select>
        )}

        {/* Add btn */}
        {addBtn && (
          <button
            onClick={() => navigate("/projects/add")}
            className="flex text-white bg-amber-600 p-2.5 rounded-sm px-10 cursor-pointer text-center items-center justify-center gap-1 min-w-max"
          >
            <ReactIcons.IoAdd />
            Add Project
          </button>
        )}
      </div>
      <Table
        data={projects}
        loading={loading.project}
        path="/projects"
        keyField="_id"
        className={{
          thead: "text-[#215675] border-b-2 border-gray-300 ",
          th: "px-2 py-3 bg-[#EDF2F7] font-medium",
          tr: "bg-white border-b-2 border-gray-300",
          td: "px-2 py-3",
        }}
        coloums={[
          {
            key: "name",
            header: "Project Name",
            render: (row) => (
              <div className="flex items-center">
                <img
                  className="w-7 h-7 mr-3"
                  src={row.icon || null}
                  alt="icon"
                />
                <div className="text-left">
                  <strong className="font-medium">{row.name}</strong>
                  <p className="text-[#616161] text-[11px] text-left">
                    {row.category}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "client",
            header: "Client",
            render: (row) => (
              <span className="text-[#215675]">{row.client}</span>
            ),
          },
          {
            key: "members",
            header: "Team Members",
            render: (row, index) => (
              <div>
                {" "}
                <AvatarGroup
                  className="mx-auto"
                  avatars={row.employees}
                  sizeInPixel={30}
                  spacing={20}
                />
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "duration",
            header: "Hours",
            render: (row, index) => (
              <span className="text-[#215675]">{row.duration}</span>
            ),
          },
          ...(loggedUser.role.includes("Admin") && actions
            ? [
                {
                  key: "action",
                  header: "Actions",
                  render: (row, index) => (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${row._id}/edit`);
                        }}
                        className="px-3 py-1 text-green-800 bg-slate-300 rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(row._id);
                        }}
                        className="px-3 py-1 text-red-800 bg-slate-300 rounded-md "
                      >
                        Delete
                      </button>
                    </>
                  ),
                },
              ]
            : []),
        ]}
      />

      {/* Pagination */}
      {pagination && projects.length > 0 && (
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

export function Projects() {
  const location = useLocation();
  const isManageTable =
    !location.pathname.includes("/projects/") &&
    location.pathname === "/projects";
  return isManageTable ? (
    <ManageProjects
      addBtn={true}
      search={true}
      status={true}
      title={true}
      pagination={true}
      actions={true}
    />
  ) : (
    <Outlet />
  );
}
