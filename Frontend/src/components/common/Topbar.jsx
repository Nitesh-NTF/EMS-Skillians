import React from "react";
import { images } from "../constants/images";
import { useSelector } from "react-redux";
import NotificationBell from "../notifications/NotificationBell";
import { useNavigate } from "react-router-dom";

export const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white drop-shadow-sm p-1 fixed  top-0 w-full left-0 z-40`}
    >
      <div className="flex justify-end items-center gap-6 mr-5">
        <NotificationBell />
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 hover:bg-gray-200 cursor-pointer transition p-1 rounded-md"
        >
          <img className="rounded-full w-7" src={user.icon} alt="proflie" />
          <span>{user.name}</span>
        </div>
      </div>
    </div>
  );
};
