import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuClock3,
  LuFolderOpen,
  LuUsers,
  LuChevronRight,
} from "react-icons/lu"; // Added LuUsers

export default function AdminSidebar() {
  const linkBaseClass =
    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden";

  const linkActiveClass =
    "text-[#FFFDF8] bg-gradient-to-r from-[#5A4235] to-[#4A352B] border border-[#AD967D]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_15px_rgba(0,0,0,0.25)] font-medium";

  const linkInactiveClass =
    "text-[#CCC2B6] hover:text-[#FFFDF8] hover:bg-[#FFFDF8]/5";

  const renderChevron = (isActive) => {
    if (!isActive) return null;
    return <LuChevronRight className="text-[#AD967D] animate-pulse" size={20} />;
  };

  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-[#715345] to-[#462f23] p-6 flex flex-col text-[#FFFDF8] shadow-2xl relative z-10">
      
      {/* Header Logo */}
      <h2 className="text-2xl font-bold mb-12 tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF8] to-[#EFE6DC]">
        StudyShare
      </h2>

      {/* Main Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-4">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-4">
                <LuLayoutDashboard size={22} />
                <span>Dashboard</span>
              </div>
              {renderChevron(isActive)}
            </>
          )}
        </NavLink>

        <NavLink
          to="/admin/pending"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-4">
                <LuClock3 size={22} />
                <span>Pending Approvals</span>
              </div>
              {renderChevron(isActive)}
            </>
          )}
        </NavLink>

        <NavLink
          to="/admin/manage"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-4">
                <LuFolderOpen size={22} />
                <span>Manage Materials</span>
              </div>
              {renderChevron(isActive)}
            </>
          )}
        </NavLink>

        {/* ================= NEW: User Details ================= */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-4">
                <LuUsers size={22} />
                <span>User Details</span>
              </div>
              {renderChevron(isActive)}
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}
