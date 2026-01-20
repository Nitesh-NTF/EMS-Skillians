import React from "react";
import { useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { markAsRead, removeNotification } from "../../store/notificationSlice";
import {
  markNotificationAsRead,
  deleteNotification,
} from "../../service/apis/notification";
import { ReactIcons } from "../constants/react_icons";
import { formatDate } from "../../utils/helpingFns";

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = async () => {
    try {
      await markNotificationAsRead(notification._id);
      dispatch(markAsRead(notification._id));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification._id);
      dispatch(removeNotification(notification._id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div
      className={`p-1.5 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? "bg-blue-50 border-blue-500" : ""
      }`}
      onClick={!notification.isRead ? handleMarkAsRead : undefined}
    >
      <div className="flex items-start gap-1">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Read Badge */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-xs">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>

          {/* Message */}
          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
            {notification.message}
          </p>

          {/* Time */}
          <p className="text-gray-400 text-[8px] mt-1">
            {formatDate(notification.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Mark as read"
            >
              <ReactIcons.RiCheckDoubleFill className="text-blue-500" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
            title="Delete notification"
          >
            <MdClose size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
