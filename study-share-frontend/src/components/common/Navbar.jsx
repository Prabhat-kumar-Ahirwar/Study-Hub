import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const role = user?.role?.toUpperCase();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-[#E6DED6] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center text-[#3E2C23]">
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl md:text-2xl font-extrabold cursor-pointer text-[#6F4E37]"
        >
          StudyHub
        </h1>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 md:gap-8 text-sm md:text-base font-medium">
          <Link to="/" className="hover:text-[#6F4E37] transition">
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/materials"
                className="hover:text-[#6F4E37] transition"
              >
                Materials
              </Link>

              {/* ✅ Upload allowed for BOTH USER & ADMIN */}
              {(role === "USER" || role === "ADMIN") && (
                <Link
                  to="/upload"
                  className="hover:text-[#6F4E37] transition"
                >
                  Upload
                </Link>
              )}

              {/* Admin Panel */}
              {role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="hover:text-[#6F4E37] transition"
                >
                  Admin
                </Link>
              )}
            </>
          )}

          {/* AUTH BUTTONS */}
          {!user ? (
            <>
              <Link to="/login" className="hover:text-[#6F4E37] transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 md:px-5 py-2 rounded-full bg-[#6F4E37] text-white font-semibold hover:bg-[#5A3A28] transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <FaUserCircle
                size={28}
                className="cursor-pointer text-[#6F4E37]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-[#E6DED6]">
                  <div className="px-4 py-3 text-sm text-gray-600">
                    Signed in as
                    <div className="font-semibold text-[#3E2C23]">
                      {user.name}
                    </div>
                    <div className="text-xs text-[#8B7765] uppercase">
                      {role}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 transition rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
