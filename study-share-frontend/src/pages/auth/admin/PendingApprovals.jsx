import { useEffect, useState } from "react";
import api from "../../../api/axios";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

export default function PendingApprovals() {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("ALL");

  // ================= FETCH =================
  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials/admin/pending");
      setMaterials(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load pending materials ❌");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

 // ================= VIEW / DOWNLOAD =================
const viewMaterial = async (m) => {
  try {
    const res = await api.get(`/materials/admin/view/${m.id}`, {
      responseType: "blob",
    });

    const file = new Blob([res.data], { type: res.headers["content-type"] });
    const fileURL = window.URL.createObjectURL(file);

    // Create a temporary link to download
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = m.fileName || "material.pdf"; // fallback filename
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Optional: revoke object URL after download
    window.URL.revokeObjectURL(fileURL);

  } catch {
    toast.error("Unable to download material ❌");
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

  // ================= REJECT =================
  const rejectMaterial = async (id) => {
    if (!window.confirm("Delete this material permanently?")) return;

    try {
      await api.delete(`/materials/admin/${id}`);
      toast.success("Material rejected ❌");
      fetchMaterials();
    } catch {
      toast.error("Rejection failed ❌");
    }
  };

  // ================= HELPERS =================
  const getCategory = (m) => m.materialType || m.category || "UNKNOWN";
  const getStatus = (m) => (m.approved ? "APPROVED" : "PENDING");

  // ================= FILTER =================
  const filteredMaterials = materials.filter((m) => {
    const matchSearch =
      m.fileName?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase());

    const matchSemester =
      semester === "ALL" || m.semester === Number(semester);

    return matchSearch && matchSemester;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <Toaster />
        <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>

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
              {filteredMaterials.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 truncate max-w-xs">{m.fileName}</td>
                  <td className="p-3">{m.subject}</td>
                  <td className="p-3">{m.semester}</td>
                  <td className="p-3">{getCategory(m)}</td>

                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      {getStatus(m)}
                    </span>
                  </td>

                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => viewMaterial(m)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>

                    <button
                      onClick={() => approveMaterial(m.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectMaterial(m.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No pending materials 🎉
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
