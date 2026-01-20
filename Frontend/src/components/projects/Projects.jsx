import { Outlet, useLocation } from "react-router-dom";
import { ManageProjects } from "./ManageProjects";
import { useSelector } from "react-redux";
import { MyProjects } from "./MyProjects";

export function Projects() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isManageTable =
    !location.pathname.includes("/projects/") &&
    location.pathname === "/projects";

  if (isManageTable) {
    return user.role.includes("Admin") ? (
      <ManageProjects
        addBtn={true}
        search={true}
        status={true}
        title={true}
        pagination={true}
        actions={true}
      />
    ) : (
      <MyProjects />
    );
  } else {
    return <Outlet />;
  }
}
