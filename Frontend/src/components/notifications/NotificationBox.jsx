import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { setNotifications, markAllAsRead } from "../../store/notificationSlice";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../../service/apis/notification";
import NotificationItem from "./NotificationItem";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../common/Pagination";
import { Loader } from "../common/Loading";
import toast from "react-hot-toast";
import { SearchBar } from "../common/SearchBar";

const NotificationBox = ({
  onClose,
  search = false,
  header = false,
  viewAllBtn = false,
  pagination = false,
}) => {
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    keyword: "",
  });
  const timerRef = useRef();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function handleSearch(e) {
    const { name, value } = e.target;
    console.log("{ name, value }", { name, value });
    setQuery({ ...query, [name]: value });
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const fetchNotificationsFn = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications({ ...query, page, limit });
      // console.log('res', res)
      dispatch(setNotifications(res.data.notifications));
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.log("error", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, [query, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [query, limit]);

  // useEffect(() => {
  //   fetchNotificationsFn();
  // }, [page]);

  useEffect(() => {
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchNotificationsFn(), 1000);
  }, [query, fetchNotificationsFn]);

  return (
    <div>
      <div className="flex flex-col h-full bg-white">
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

            {/* search */}
            <div className="mx-2">
              {search && (
                <SearchBar
                  placeholder="Search keywords..."
                  name="keyword"
                  value={query.keyword}
                  onChange={handleSearch}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              {header && viewAllBtn && (
                <button
                  onClick={() => navigate("/inbox")}
                  className="text-xs cursor-pointer rounded-sm bg-blue-600 text-white py-0.5 px-2"
                >
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
          {loading ? (
            <Loader />
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

        {/* paginations */}
        {pagination && notifications.length > 0 && (
          <Pagination
            changePage={setPage}
            page={page}
            total={total}
            limit={limit}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationBox;
