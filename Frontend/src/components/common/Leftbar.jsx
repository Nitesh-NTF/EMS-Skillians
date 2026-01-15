import React, { useState } from "react";
import { images } from "../constants/images";
import { ReactIcons } from "../constants/react_icons";

import { useLocation, useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../service/authentication";
import { logout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FullScreenLoader } from "./Loading";

const adminRoutes = [
  {
    header: "Dashboard",
    path: "/dashboard",
    icon: <ReactIcons.LiaHomeSolid />,
  },
  {
    header: "Employee",
    path: "/employees",
    icon: <ReactIcons.ImUser />,
  },
  // { header: "Time", path: "/time", icon: <ReactIcons.RiTimerLine /> },
  {
    header: "Project",
    path: "/projects",
    icon: <ReactIcons.FaRegFileAlt />,
  },
  // {
  //   header: "report",
  //   path: "/report",
  //   icon: <ReactIcons.BsFileEarmarkBarGraph />,
  // },
  {
    header: "Setting",
    path: "/setting",
    icon: <ReactIcons.MdOutlineSettings />,
  },
];

const employeeRoutes = [
  {
    header: "Dashboard",
    path: "/dashboard",
    icon: <ReactIcons.LiaHomeSolid />,
  },
  {
    header: "Project",
    path: "/my-projects",
    icon: <ReactIcons.FaRegFileAlt />,
  },
  {
    header: "Setting",
    path: "/setting",
    icon: <ReactIcons.MdOutlineSettings />,
  },
];

export const Leftbar = () => {
  const [collapse, setCollapse] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  let routesToUse;
  if (user?.role?.includes("Admin")) routesToUse = adminRoutes;
  else if (user?.role?.includes("Employee")) routesToUse = employeeRoutes;

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await logoutApi();
      dispatch(logout(res.data));
      toast.success(res.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ width: collapse ? "50px" : "200px" }}
      className=" relative z-50"
    >
      {loading && <FullScreenLoader />}
      <div
        style={{ width: collapse ? "50px" : "200px" }}
        className="min-h-screen pb-2 text-white bg-[#215675] fixed flex flex-col justify-between"
      >
        {/* <div className="flex flex-col justify-between"> */}
        <div className="w-full">
          <div
            style={{ visibility: collapse && "hidden" }}
            className={`bg-white flex justify-center items-center py-4`}
          >
            <img src={images.logo} alt="logo" />
          </div>
          <nav className="pt-6">
            <ul>
              {routesToUse?.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 ${
                      collapse ? "px-1 justify-center" : "pl-6"
                    } py-1.5 mb-2.5 ${
                      location.pathname.includes(item.path)
                        ? "bg-white text-cyan-900"
                        : ""
                    }`}
                  >
                    <span className={`${collapse && "text-xl"}`}>
                      {" "}
                      {item.icon}
                    </span>
                    {!collapse && item.header}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="w-full">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 ${
              collapse ? "px-1 justify-center" : "pl-6"
            } py-1.5 mb-2.5`}
          >
            <span className={`${collapse && "text-xl"}`}>
              <ReactIcons.MdLogout />
            </span>
            {!collapse && "Logout"}
          </button>
          <div className="flex justify-end pr-2 ">
            <button
              onClick={() => setCollapse(!collapse)}
              className="text-black bg-gray-100 p-2.5 rounded-md flex justify-center items-center"
            >
              <ReactIcons.IoIosArrowBack
                className={collapse ? "rotate-180 transition" : ""}
              />
            </button>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};
