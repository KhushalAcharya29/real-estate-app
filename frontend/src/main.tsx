import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App"; // ✅ import App instead of AppRoutes
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App /> {/* ✅ render App (which includes the intro video) */}
      <Toaster position="top-right" />
    </Provider>
  </React.StrictMode>
);
