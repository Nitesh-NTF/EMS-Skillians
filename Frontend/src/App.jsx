import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store.js";
import toast, { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import { initializeSocket, disconnectSocket } from "./service/socket";
import { getUnreadCount } from "./service/apis/notification";
import { setUnreadCount } from "./store/notificationSlice";
// import { fetchLoggedUser } from "./store/authSlice";

import { router } from "./routing/Router";
import { me } from "./service/apis/authentication.js";
import { fetchUser, login } from "./store/authSlice.js";
import { PulseLoader } from "./components/common/Loading.jsx";

// const SocketInitializer = () => {
//   const dispatch = useDispatch();
//   const { isLogged, user } = useSelector((state) => state.auth);

//   const fetchLoggedUser = async () => {
//     try {
//       const res2 = await me()
//       console.log('res', res)
//       dispatch(login(res.data));
//     } catch (error) {
//       console.error("error", error);
//       toast.error(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     fetchLoggedUser();
//   }, [dispatch]);

//   const fetchUnreadNotificationFn = async () => {
//     if (isLogged && user?.token) {
//       initializeSocket(user.token);

//       // Fetch unread count on app load
//       try {
//         const res = await getUnreadCount();
//         dispatch(setUnreadCount(res.data.unreadCount));
//       } catch (error) {
//         console.error("error", error);
//         toast.error(error.response.data.message);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchUnreadNotificationFn();
//     // Cleanup on logout or unmount
//     return () => {
//       disconnectSocket();
//     };
//   }, [isLogged, user?.token, dispatch]);

//   return null;
// };

const SocketInitializer = () => {
  const dispatch = useDispatch();
  const { isLogged, user, loading } = useSelector((state) => state.auth);
  console.log("SocketInitializer");
  useEffect(() => {
    console.log("socket initializer effect");
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (isLogged && user) {
      const fetchUnreadCount = async () => {
        try {
          initializeSocket();
          const res = await getUnreadCount();
          dispatch(setUnreadCount(res.data.unreadCount));
        } catch (error) {
          console.error("error", error);
        }
      };
      fetchUnreadCount();
    }

    return () => {
      disconnectSocket();
    };
  }, [isLogged, user, dispatch]);

  return null;
};

function App() {
  const { loading } = useSelector((state) => state.auth);

  SocketInitializer()

  if (loading) {
    return <PulseLoader />; // Or your loading component
  }

  return (
    <>
      {/* <SocketInitializer /> */}
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

// function App() {
//   return (
//     <>
//       <Provider store={store}>
//         <SocketInitializer />
//         <RouterProvider router={router} />
//         <Toaster position="top-right" reverseOrder={false} />
//       </Provider>
//     </>
//   );
// }

export default App;
