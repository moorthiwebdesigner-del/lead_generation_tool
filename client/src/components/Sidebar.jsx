import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSearch,
  FaDatabase,
  FaFileExport,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const menus = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/",
    },
    {
      title: "Search Leads",
      icon: <FaSearch />,
      path: "/search",
    },
    {
      title: "Saved Leads",
      icon: <FaDatabase />,
      path: "/saved-leads",
    },
    {
    title: "Analytics",
    icon: <FaFileExport />,
    path: "/analytics",
  },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-blue-400">
          LeadGen
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Business Finder
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6">

        {menus.map((menu) => (
          <NavLink
            key={menu.title}
            to={menu.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-4 px-6 py-4 transition duration-300 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{menu.icon}</span>

            <span className="font-medium">
              {menu.title}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700">

        <p className="text-sm text-slate-400">
          Version 1.0
        </p>

        <p className="text-xs text-slate-500 mt-2">
          © 2026 Moorthi Web Studio
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;