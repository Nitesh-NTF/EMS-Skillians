import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoNotifications } from "react-icons/io5";
import NotificationBox from "./NotificationBox";
import { useNavigate } from "react-router-dom";

/**
 * Notification Bell Component
 * Shows bell icon with unread count badge
 * Opens notification drawer on click
 */
const NotificationBell = () => {
  const { unreadCount } = useSelector((state) => state.notifications);
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => navigate("/inbox")}
        className="relative p-2 text-xl text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Notifications"
        title="Notifications"
      >
        <IoNotifications size={24} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-2/6  bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
