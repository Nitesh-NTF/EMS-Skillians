import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { markAsRead } from "../../store/notificationSlice";
import {
  getNotificationById,
  markNotificationAsRead,
} from "../../service/apis/notification";
import { extractDateTimeFromCreatedAt } from "../../utils/helpingFns";

export const ViewNotificationModal = () => {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotification = async () => {
    // setLoading(true);
    try {
      const res = await getNotificationById(notificationId);
      setNotification(res.data);

      if (!res.data.isRead) {
        await markNotificationAsRead(notificationId);
        dispatch(markAsRead(notificationId));
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load notification", error);
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!notificationId) return;
    fetchNotification();
  }, [notificationId, dispatch, navigate]);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 200);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center 
      bg-black/40 backdrop-blur-sm transition-opacity duration-200
      ${isClosing ? "opacity-0" : "opacity-100"}`}
    >
      <div
        ref={modalRef}
        className={`bg-white w-full max-w-lg rounded-xl shadow-xl 
        transform transition-all duration-200
        ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          {loading ? (
            <div className="h-5 bg-gray-300 rounded w-2/6 animate-pulse"></div>
          ) : (
            <>
              {" "}
              <h2 className="text-xl font-semibold text-gray-900">
                {notification.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {extractDateTimeFromCreatedAt(notification.createdAt).date}{" "}
                {extractDateTimeFromCreatedAt(notification.createdAt).time}
              </p>
            </>
          )}
        </div>

        {/* Meta */}
        <div className="px-6 py-4 flex flex-wrap gap-2 text-xs">
          {loading ? (
            <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          ) : (
            <>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                <strong>From:</strong>{" "}
                {notification.triggeredBy?.name || "System"}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                <strong>To:</strong>{" "}
                {notification.recipients?.map((r) => r.name) || "You"}
              </span>
            </>
          )}
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
            {loading ? (
              <>
                <div className="h-20 bg-gray-300 rounded w-full animate-pulse"></div>
              </>
            ) : (
              <>{notification.message}</>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2 text-sm font-medium 
            bg-gray-800 text-white rounded-lg 
            hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
