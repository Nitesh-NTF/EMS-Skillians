import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import {
  setNotifications,
  markAllAsRead,
  setLoading,
  setError,
} from "../../store/notificationSlice";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../../service/notification";
import NotificationItem from "./NotificationItem";
import { useLocation } from "react-router-dom";
import { Pagination } from "../common/Pagination";

/**
 * Notification Box Component
 * Displays list of notifications with pagination and actions
 */
const NotificationBox = ({
  onClose,
  header = false,
  viewAllBtn = false,
  pagination = false,
}) => {
  const dispatch = useDispatch();
  const { notifications, isLoading, unreadCount } = useSelector(
    (state) => state.notifications
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch notifications on mount or page change
  useEffect(() => {
    dispatch(setLoading(true));
    fetchNotifications(page, 6)
      .then((data) => {
        dispatch(setNotifications(data.notifications));
        setTotalPages(data.pagination.pages);
      })
      .catch((error) => {
        dispatch(setError(error.message));
      });
  }, [page, dispatch]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

   const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white" >
      {/* Header */}
      {header && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {header && viewAllBtn && (
              <button className="text-xs cursor-pointer rounded-sm bg-blue-600 text-white py-0.5 px-2">
                View All
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Mark all as read"
              >
                <MdOutlineMarkEmailRead size={20} className="text-blue-600" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors lg:hidden"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      )}
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer - Pagination */}
      {/* {pagination && notifications.length > 0  && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 text-sm">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
          >
            Next
          </button>
        </div>
      )} */}

      {pagination && notifications.length > 0 && (
        <Pagination
          changePage={setPage}
          page={page}
          total={totalPages}
          limit={6}
        />
      )}
    </div>
  );
};

export default NotificationBox;
