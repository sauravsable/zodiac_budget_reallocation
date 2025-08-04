import React from "react";
import { BarChart2, Layout, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="relative h-screen w-64 flex flex-col justify-between p-6">
      {/* Sidebar Blue Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 rounded-r-3xl z-0" />

      {/* Soft Dark Overlay for Depth */}
      <div className="absolute inset-0 bg-black/20 rounded-r-3xl z-0" />

      {/* Frosted Glass Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2)] rounded-r-3xl z-10" />

      {/* Sidebar Content */}
      <div className="relative z-20 flex flex-col h-full">
        {/* Logo */}
        <div className="text-center text-4xl font-bold tracking-tight text-white drop-shadow-xl mb-12">
          Zodiac<span className="text-blue-300">.ai</span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col gap-3">
          <SidebarItem icon={<BarChart2 size={22} />} label="Budget Allocation" />
          <SidebarItem icon={<Layout size={22} />} label="Whitespace Analysis" />
          <SidebarItem icon={<Settings size={22} />} label="Automation" />
        </div>

        {/* Sticky Logout */}
        <div className="pt-6 mt-8 border-t border-white/20">
          <SidebarItem icon={<LogOut size={22} />} label="Logout" />
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => {
  const location = useLocation();

  const getPathFromLabel = (label) => {
    switch (label) {
      case "Budget Allocation":
        return "/";
      case "Whitespace Analysis":
        return "/whitespace-analysis";
      case "Automation":
        return "/automation";
      case "Logout":
        return "/logout";
      default:
        return "/";
    }
  };

  const isActive = location.pathname === getPathFromLabel(label);
  const path = getPathFromLabel(label);

  return (
    <Link to={path} className="no-underline">
      <div
        className={`group relative flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
          ${isActive ? "active-sidebar-item" : "hover:bg-white/10"}
        `}
        style={{
          transform: isActive ? "scale(1.05)" : "",
          boxShadow: isActive
            ? "inset 2px 2px 5px rgba(255,255,255,0.3), inset -2px -2px 8px rgba(0,0,0,0.2), 0 4px 20px rgba(0,255,0,0.15)"
            : "",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {/* Water Drop Active Background */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 opacity-90 rounded-2xl shadow-inner shadow-emerald-800/30" />
        )}

        {/* Water Drop Hover Bubble Effect */}
        {!isActive && (
          <div className="absolute inset-0 rounded-2xl group-hover:bg-white/10 group-hover:backdrop-blur-md transition-all duration-300" />
        )}

        {/* Active Border Indicator */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full bg-gradient-to-b from-white to-green-300 transition-all duration-300 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
          }`}
        />

        {/* Icon */}
        <div
          className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? "text-white" : "text-white/70 group-hover:text-white"
          }`}
        >
          {icon}
        </div>

        {/* Label */}
        <span
          className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${
            isActive ? "text-white" : "text-white/80 group-hover:text-white"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
