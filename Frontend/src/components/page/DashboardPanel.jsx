import React from "react";
import { Topbar } from "../common/Topbar";
import { Leftbar } from "../common/Leftbar";
import { Outlet } from "react-router-dom";

export const DashboardPanel = () => {
  return (
    <div className="flex">
      <div>
        <Leftbar />
      </div>
      <div className="w-full text-sm">
        <Topbar />
        <div className="bg-white">
        <div className="mx-5 bg-[#D6F5FF4D] min-h-screen pt-18 px-7 relative">
          <Outlet />
        </div>
        </div>
      </div>
    </div>
  );
};
