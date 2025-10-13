import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h3>ResolveIT Portal</h3>
        </div>
        <div className="navbar-menu">
          <button
            className={`navbar-item ${isActive("/dashboard")}`}
            onClick={() => handleNavigation("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`navbar-item ${isActive("/admin")}`}
            onClick={() => handleNavigation("/admin")}
          >
            Admin Panel
          </button>
          <button
            className={`navbar-item ${isActive("/reports")}`}
            onClick={() => handleNavigation("/reports")}
          >
            Reports
          </button>
          <button className="navbar-item logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
