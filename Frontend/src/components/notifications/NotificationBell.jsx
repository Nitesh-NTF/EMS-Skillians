import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoNotifications } from "react-icons/io5";
import NotificationBox from "./NotificationBox";

/**
 * Notification Bell Component
 * Shows bell icon with unread count badge
 * Opens notification drawer on click
 */
const NotificationBell = () => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={handleToggle}
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

      {/* Notification Box Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:static lg:z-auto lg:inset-auto" >
          {/* Overlay on mobile */}
          {/* <div
            className="fixed inset-0 bg-opacity-50 lg:hidden"
            onClick={handleClose}
          /> */}

          {/* Notification Box */}
          <div className="fixed right-0 top-0 w-full max-w-md bg-white shadow-lg z-50 lg:top-12 lg:right-0 lg:max-w-md lg:rounded-lg lg:border lg:border-gray-200 overflow-hidden flex flex-col">
            <NotificationBox
              onClose={handleClose}
              header={true}
              viewAllBtn={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
