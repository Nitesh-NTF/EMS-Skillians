import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store.js";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import { initializeSocket, disconnectSocket } from "./service/socket";
import { getUnreadCount } from "./service/notification";
import { setUnreadCount } from "./store/notificationSlice";

import { router } from "./routing/Router";

// Socket initialization component
const SocketInitializer = () => {
  const dispatch = useDispatch();
  const { isLogged, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLogged && user?.token) {
      // Initialize socket connection
      initializeSocket(user.token);

      // Fetch unread count on app load
      getUnreadCount()
        .then((count) => {
          dispatch(setUnreadCount(count));
        })
        .catch((error) => console.error("Error fetching unread count:", error));

      // Cleanup on logout or unmount
      return () => {
        disconnectSocket();
      };
    }
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
