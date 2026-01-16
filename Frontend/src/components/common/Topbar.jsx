import React from "react";
import { images } from "../constants/images";
import { useSelector } from "react-redux";
import NotificationBell from "../notifications/NotificationBell";

export const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div
      className={`bg-white drop-shadow-sm p-2 fixed  top-0 w-full left-0 z-40`}
    >
      <div className="flex justify-end items-center gap-6 mr-5">
        <NotificationBell />
        <div className="flex items-center gap-2.5">
          <img className="rounded-full w-7" src={user.icon} alt="proflie" />
          <span>{user.name}</span>
        </div>
      </div>
    </div>
  );
};
