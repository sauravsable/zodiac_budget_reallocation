import React from "react";
import { BarChart2, Layout, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-100 via-white to-white text-gray-800 flex flex-col p-4 shadow-xl border-r border-gray-200">
      {/* Logo */}
      <div className="text-2xl font-bold mb-10 flex items-center justify-center">
        <span className="text-blue-600">Zodiac.ai</span>
      </div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col gap-4">
        <SidebarItem icon={<BarChart2 size={20} />} label="Budget Allocation" />
        <SidebarItem icon={<Layout size={20} />} label="Whitespace Analysis" />
        <SidebarItem icon={<Settings size={20} />} label="Automation" />
      </div>

      {/* Divider + Sticky Logout */}
      <div className="mt-auto">
        <hr className="border-gray-300 mb-4" />
        <SidebarItem icon={<LogOut size={20} />} label="Logout" />
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
    }
  };

  const isActive = location.pathname === getPathFromLabel(label);
  const path = getPathFromLabel(label);

  return (
    <Link to={path} className="no-underline text-inherit">
      <div
        className={`${
          isActive ? "bg-blue-200" : ""
        } flex items-center gap-3 hover:bg-blue-200 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200`}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
