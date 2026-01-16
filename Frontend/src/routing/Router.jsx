import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  BrowserRouter as Routing,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Login } from "../components/auth/Login";
import { Home } from "../components/page/Home";
import { Employees, ManageEmployee } from "../components/employees/Employees";
import { DashboardPanel } from "../components/page/DashboardPanel";
import { EmployeeDetail } from "../components/employees/EmployeeDetail";
import { AddEmployee } from "../components/employees/AddEmployee";
import { PersonalDetails } from "../components/admin/PersonalDetails";
import { AdminDashboard } from "../components/admin/AdminDashboard";
// import { TimeEntries } from "../components/admin/time_entries/TimeEntries";
import { MyProjects } from "../components/projects/MyProjects";
import { TimeReports } from "../components/reports/TimeReports";
import { Settings } from "../components/admin/Settings";
import { ManageProjects, Projects } from "../components/projects/Projects";
import { AddProject } from "../components/projects/AddProject";
import { EmployeeDashboard } from "../components/employees/EmployeeDashboard";
import { ProjectDetails } from "../components/projects/ProjectDetails";
import { WorkTImeEntries } from "../components/time_entries/WorkTImeEntries";
import { Inbox } from "../components/notifications/Inbox";

// Admin routes
const adminRoutes = [
  {
    path: "/",
    element: <DashboardPanel />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {path: "inbox", element: <Inbox/>},
      { path: "dashboard", element: <AdminDashboard /> },
      {
        path: "employees",
        element: <Employees />,
        children: [
          {
            path: ":empId",
            children: [
              {
                element: <EmployeeDetail />,
                children: [
                  { path: "workTimeEntries", element: <WorkTImeEntries /> },
                  {
                    path: "project",
                    element: <ManageProjects search={true} />,
                  },
                ],
              },
              { path: "edit", element: <AddEmployee /> },
              { path: "personalDetail", element: <PersonalDetails /> },
            ],
          },
          { path: "add", element: <AddEmployee /> },
        ],
      },
      // { path: "time", element: <TimeEntries /> },
      {
        path: "projects",
        element: <Projects />,
        children: [
          {
            path: ":projectId",
            children: [
              {
                element: <ProjectDetails />,
                children: [
                  { path: "workTimeEntries", element: <WorkTImeEntries /> },
                  {
                    path: "employee",
                    element: <ManageEmployee search={true} />,
                  },
                ],
              },

              { path: "edit", element: <AddProject /> },
            ],
          },
          { path: "add", element: <AddProject /> },
        ],
      },
      // { path: "report", element: <TimeReports /> },
      { path: "setting", element: <Settings /> },
    ],
  },
];

// Employee routes
const employeeRoutes = [
  {
    path: "/",
    element: <DashboardPanel />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <EmployeeDashboard /> },
      { path: "my-projects", element: <MyProjects /> },
      // { path: "time", element: <TimeEntries /> },
      // { path: "personalDetail", element: <PersonalDetails /> },
      { path: "setting", element: <Settings /> },
    ],
  },
];

// Recursive function to render nested routes
const renderRoutes = (routes) => {
  return routes?.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={route.element}
      index={route.index}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

const ProtectedRoute = () => {
  const { isLogged, user } = useSelector((state) => state.auth);

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Return routes based on user role
  let routesToUse;
  if (user?.role?.includes("Admin")) routesToUse = adminRoutes;
  else if (user?.role?.includes("Employee")) routesToUse = employeeRoutes;

  return (
    <Routes>
      {renderRoutes(routesToUse)}
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
};

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/forget-password", element: <Login /> },
  { path: "/reset-password", element: <Login /> },
  {
    path: "/*",
    element: <ProtectedRoute />,
  },
]);
