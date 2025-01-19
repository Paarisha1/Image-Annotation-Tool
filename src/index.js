import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Router only here
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* ✅ Ensure Router wraps only App */}
      <App />
    </Router>
  </React.StrictMode>
);
