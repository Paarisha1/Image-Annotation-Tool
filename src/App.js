import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ImageCanvas from "./components/ImageCanvas";
import html2canvas from "html2canvas";
import { FaUpload, FaSave, FaSignOutAlt } from "react-icons/fa";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./index.css";

const App = () => {
  const [image, setImage] = useState(null);
  const imageContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadAnnotatedImage = async () => {
    if (!image || !imageContainerRef.current) return;

    try {
      const canvas = await html2canvas(imageContainerRef.current);
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "annotated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    navigate("/"); // Redirect to Login page
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/app"
        element={
          <div
            className={`flex flex-col items-center justify-start min-h-screen transition-all duration-300 ${
              darkMode
                ? "bg-gray-900 text-white"
                : "bg-gradient-to-b from-[#1E3A5F] to-[#0A1C33] text-gray-900"
            } p-6 relative`}
          >
            {/* Dark Mode Toggle */}
            <div className="absolute top-6 right-6 flex flex-col items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-700 peer-checked:bg-blue-600"></div>
              </label>
              <span
                className={`mt-1 text-xs font-semibold ${
                  darkMode ? "text-gray-300" : "text-white"
                }`}
              >
                {darkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="absolute top-6 left-6 bg-[#1E3A5F] hover:bg-[#25476D] text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 flex items-center justify-center gap-2 shadow-md"
            >
              <FaSignOutAlt className="text-white" size={18} />
              Logout
            </button>

            {/* Stylish Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 text-center">
              Image Annotation Tool
            </h1>

            {/* Main Card */}
            <div
              className={`w-full max-w-md ${
                darkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white/20 border-white/30"
              } backdrop-blur-lg rounded-3xl shadow-lg p-6 flex flex-col items-center text-center border mt-8`}
            >
              {/* Toggle for Upload & Save */}
              <div className="w-full flex items-center justify-between bg-gray-700 rounded-full p-1">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`w-1/2 py-2 rounded-full text-sm font-semibold ${
                    activeTab === "upload"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-300"
                  }`}
                >
                  Upload Image
                </button>
                <button
                  onClick={() => setActiveTab("save")}
                  className={`w-1/2 py-2 rounded-full text-sm font-semibold ${
                    activeTab === "save"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-300"
                  }`}
                >
                  Save Image
                </button>
              </div>

              {/* Conditional Display */}
              <div className="w-full mt-6">
                {activeTab === "upload" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="w-full bg-[#1E3A5F] hover:bg-[#25476D] text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 text-center flex items-center justify-center gap-2"
                    >
                      <FaUpload className="text-white" size={18} />
                      Select Image
                    </label>
                  </div>
                ) : (
                  <button
                    onClick={handleDownloadAnnotatedImage}
                    className="w-full bg-[#0A1C33] hover:bg-[#142D4C] text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 flex items-center justify-center gap-2"
                    disabled={!image}
                  >
                    <FaSave className="text-white" size={18} />
                    Save Annotated Image
                  </button>
                )}
              </div>
            </div>

            {/* Image Preview */}
            {image && (
              <div
                ref={imageContainerRef}
                className={`mt-6 w-full max-w-4xl flex justify-center border-4 ${
                  darkMode
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-400 bg-[#1E3A5F]"
                } rounded-3xl shadow-lg p-4`}
              >
                <ImageCanvas image={image} />
              </div>
            )}
          </div>
        }
      />
    </Routes>
  );
};

export default App;
