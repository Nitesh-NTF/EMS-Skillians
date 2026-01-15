import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { router } from "./routing/Router";

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </>
  );
}

export default App;
