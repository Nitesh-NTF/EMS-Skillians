import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store.js";
import toast, { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import { initializeSocket, disconnectSocket } from "./service/socket";
import { getUnreadCount } from "./service/apis/notification";
import { setUnreadCount } from "./store/notificationSlice";

import { router } from "./routing/Router";

const SocketInitializer = () => {
  const dispatch = useDispatch();
  const { isLogged, user } = useSelector((state) => state.auth);

  const fetchFn = async () => {
    if (isLogged && user?.token) {
      initializeSocket(user.token);

      // Fetch unread count on app load
      try {
        const res = await getUnreadCount();
        // console.log('res', res)
        dispatch(setUnreadCount(res.data.unreadCount));
      } catch (error) {
        console.error("error", error);
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchFn();
    // Cleanup on logout or unmount
    return () => {
      disconnectSocket();
    };
  }, [isLogged, user?.token, dispatch]);

  return null;
};

function App() {
  return (
    <>
      <Provider store={store}>
        <SocketInitializer />
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </>
  );
}

export default App;
