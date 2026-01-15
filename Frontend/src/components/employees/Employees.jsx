import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../common/BackButton";
import { Table } from "../common/Table";
import { Pagination } from "../common/Pagination";
import { SearchBar } from "../common/SearchBar";
import { ReactIcons } from "../constants/react_icons";
import { deleteEmployee, fetchEmployees } from "../../service/employee";
import { StatusBadge } from "../common/StatusBadge";

export const ManageEmployee = ({
  search = false,
  status = false,
  addBtn = false,
  title = false,
  pagination = false,
  actions = false,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    search: "",
    department: "",
  });
  const [loading, setLoading] = useState({ user: true });
  const timerRef = useRef();
  const { projectId } = useParams();
  const loggedUser = useSelector((state) => state.auth.user);

  function handleSearch(e) {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  }

  async function handleDelete(id) {
    setLoading((prev) => ({ ...prev, user: true }));
    try {
      const res = await deleteEmployee(id);
      toast.success(res.message);
      fetchFn();
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  }

  console.log("user", user);
  const fetchFn = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      const res = await fetchEmployees({
        ...query,
        ...(pagination && { page, limit }),
        ...(projectId && { project: [projectId] }),
      });
      setUser(res.data.employees);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.log("err: ", error);
      toast.error(error.response?.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  }, [query, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [query, limit]);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, user: true }));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchFn(), 1000);
  }, [query, fetchFn]);

  return (
    <div>
      {/* title */}
      {title && <BackButton title="Employee Management" />}

      <div className="text-gray-600 flex items-center gap-8 my-4">
        {/* search */}
        {search && (
          <SearchBar
            placeholder="Search Employees..."
            value={query.search}
            onChange={handleSearch}
          />
        )}

        {/* status filter */}
        {status && (
          <select className="input" name="department" onChange={handleSearch}>
            <option value="">All Departments</option>
            {["Development", "UI/UX", "Bubble"].map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        )}

        {/* Add btn */}
        {addBtn && (
          <button
            onClick={() => navigate("/employees/add")}
            className="flex text-white bg-amber-600 p-2.5 rounded-sm px-10 cursor-pointer text-center items-center justify-center gap-1 min-w-max"
          >
            <ReactIcons.IoAdd />
            Add Employee
          </button>
        )}
      </div>

      <Table
        data={user}
        loading={loading.user}
        keyField="_id"
        path={`/employees`}
        className={{
          thead: "text-center bg-gray-300 text-cyan-900",
          tbody: "text-gray-600",
          th: "p-2",
          tr: "border-b-2 border-b-gray-200",
          td: "py-1.5 text-center",
        }}
        coloums={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <span className="py-1.5 flex items-center gap-2">
                {" "}
                <span className="w-7 h-7 rounded-full overflow-hidden">
                  <img
                    src={row.icon || null}
                    alt="emp_profile"
                    className="w-full scale-110"
                  />
                </span>
                {row.name}
              </span>
            ),
          },
          { key: "email", header: "Email" },
          { key: "department", header: "Department" },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          ...(loggedUser.role.includes("Admin") && actions
            ? [
                {
                  key: "action",
                  header: "Action",
                  render: (row) => (
                    <>
                      {" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/employees/${row._id}/edit`);
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

      {pagination && user.length > 0 && (
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

export function Employees() {
  const location = useLocation();
  const isManageTable =
    !location.pathname.includes("/employees/") &&
    location.pathname === "/employees";
  return isManageTable ? (
    <ManageEmployee
      search={true}
      status={true}
      addBtn={true}
      pagination={true}
      actions={true}
    />
  ) : (
    <Outlet />
  );
}
