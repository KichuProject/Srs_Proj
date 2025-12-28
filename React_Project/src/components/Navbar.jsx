import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Navbar = () => {
  const { logout } = useApp();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/trainers", label: "Trainers" },
    { path: "/sessions", label: "Sessions" },
    { path: "/attendance", label: "Attendance" },
    { path: "/reports", label: "Reports" },
  ];
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md bg-slate-900 text-white flex items-center justify-center font-extrabold text-base">
              TA
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-slate-500">Trainer Attendance</p>
              <p className="text-base font-semibold text-slate-900">
                Control Center
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-base transition-colors ${
                    isActive
                      ? "text-slate-900 font-semibold border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
