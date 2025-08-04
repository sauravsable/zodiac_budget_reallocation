import React from "react";
import { BarChart2, Layout, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white/60 backdrop-blur-md text-gray-700 flex flex-col px-6 py-8 shadow-2xl border-r border-gray-200">
      {/* Logo */}
      <div className="text-3xl font-extrabold text-center text-blue-600 tracking-tight mb-12">Zodiac.ai</div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col gap-2">
        <SidebarItem icon={<BarChart2 size={20} />} label="Budget Allocation" />
        <SidebarItem icon={<Layout size={20} />} label="Whitespace Analysis" />
        <SidebarItem icon={<Settings size={20} />} label="Automation" />
      </div>

      {/* Sticky Logout */}
      {/* Uncomment below for logout */}
      {/* <div className="mt-auto pt-6 border-t border-gray-300">
        <SidebarItem icon={<LogOut size={20} />} label="Logout" />
      </div> */}
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
        className={`group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 
        ${isActive ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500" : "hover:bg-blue-50"}
        `}
      >
        <div className="transition-transform duration-200 group-hover:scale-110">{icon}</div>
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
