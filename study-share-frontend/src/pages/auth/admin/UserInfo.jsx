import { useEffect, useState } from "react";
import axios from "axios";
import { LuSearch } from "react-icons/lu"; // Search icon

export default function UserInfo() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // ✅ 10 users per page

  // Search
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by email
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchEmail, users]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400">
        Loading users...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 font-medium text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-[#2a1e15] rounded-xl shadow-lg text-[#FFFDF8] h-full">
      <h2 className="text-2xl font-semibold mb-4">User Details</h2>

      {/* Search Bar */}
      <div className="relative mb-4">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AD967D]" size={18} />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg bg-[#3c2d22] text-[#FFFDF8] border border-[#5A4235] focus:outline-none focus:ring-2 focus:ring-[#AD967D] placeholder:text-[#CCC2B6]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#3c2d22] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#5A4235] text-left text-[#FFFDF8]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#AD967D]/20 hover:bg-[#715345]/30 transition-all"
                >
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role.replace("ROLE_", "")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-[#5A4235] hover:bg-[#715345] disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 rounded-lg bg-[#5A4235] hover:bg-[#715345] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
