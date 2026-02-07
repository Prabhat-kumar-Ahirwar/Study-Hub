import { useEffect, useState } from "react";
import api from "../../../api/axios";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import toast from "react-hot-toast";

export default function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("ALL");

  // ===== Editable filename state =====
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  // ================= FETCH =================
  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials/admin/materials");
      setMaterials(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to fetch materials ❌");
    }
  };

  // ================= APPROVE =================
  const approveMaterial = async (id) => {
    try {
      await api.put(`/materials/admin/approve/${id}`);
      toast.success("Material approved ✅");
      fetchMaterials();
    } catch {
      toast.error("Approval failed ❌");
    }
  };

  // ================= DELETE =================
  const rejectMaterial = async (id) => {
    if (!window.confirm("Delete this material permanently?")) return;

    try {
      await api.delete(`/materials/admin/${id}`);
      toast.success("Material deleted 🗑️");
      fetchMaterials();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  // ================= UPDATE FILENAME =================
  const updateFileName = async (id) => {
    if (!editingName.trim()) return toast.error("Filename cannot be empty");

    try {
      await api.put(`/materials/admin/update-filename/${id}`, {
        fileName: editingName.trim(),
      });
      toast.success("Filename updated ✅");
      fetchMaterials();
      setEditingId(null);
    } catch {
      toast.error("Update failed ❌");
    }
  };

  // ================= HELPERS =================
  const getStatus = (m) => (m.approved ? "APPROVED" : "PENDING");

  // ================= FILTER + SORT =================
  const filteredMaterials = materials
    .filter((m) => {
      const status = getStatus(m);
      const matchStatus = statusFilter === "ALL" || status === statusFilter;
      const matchSearch =
        m.fileName?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase());
      const matchSemester =
        semester === "ALL" || m.semester === Number(semester);

      return matchStatus && matchSearch && matchSemester;
    })
    .sort((a, b) => {
      if (a.approved !== b.approved) return a.approved ? 1 : -1; // pending first
      if (a.semester !== b.semester) return b.semester - a.semester; // higher semester first
      return b.id - a.id; // newest first
    });

  // ================= UI =================
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Materials</h1>

        {/* 🔍 FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by filename or subject"
            className="border px-4 py-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* 📋 TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">File</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMaterials.map((m) => {
                const id = m.id;
                const status = getStatus(m);

                return (
                  <tr key={id} className="border-t hover:bg-gray-50">
                    {/* Editable filename */}
                    <td className="p-3 max-w-2xl">
                      {editingId === id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => updateFileName(id)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && updateFileName(id)
                          }
                          autoFocus
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <div className="flex justify-between items-center space-x-2 overflow-x-auto">
                          <span className="truncate max-w-xl">{m.fileName}</span>
                          <button
                            onClick={() => {
                              setEditingId(id);
                              setEditingName(m.fileName);
                            }}
                            className="text-blue-600 text-xs whitespace-nowrap"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-3">{m.subject}</td>
                    <td className="p-3">{m.semester}</td>
                    <td className="p-3">{m.materialType}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-3 text-center space-x-2">
                      {!m.approved && (
                        <button
                          onClick={() => approveMaterial(id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => rejectMaterial(id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No materials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
