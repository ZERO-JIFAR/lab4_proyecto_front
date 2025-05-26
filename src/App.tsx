import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div>
        <button className="theme-toggle" onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "🌞" : "🌙"}
        </button>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
export default App
