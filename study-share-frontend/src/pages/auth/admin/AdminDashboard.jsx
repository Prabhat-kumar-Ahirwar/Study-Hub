import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../api/axios";
import AdminSidebar from "../../../components/admin/AdminSidebar";

// Chart imports
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({ pyq: 0, assignments: 0, notes: 0, mst: 0 });

  // ================= FETCH =================
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const resAll = await api.get("/materials/admin/materials");
      const allMaterials = Array.isArray(resAll.data) ? resAll.data : [];
      calculateStats(allMaterials);

      const pending = allMaterials
        .filter((m) => !m.approved)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setPendingMaterials(pending);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch materials");
    } finally {
      setLoading(false);
    }
  };

  // ================= CALCULATE STATS =================
  const calculateStats = (allMaterials) => {
    const newStats = { pyq: 0, assignments: 0, notes: 0, mst: 0 };
    allMaterials.forEach((m) => {
      if (!m.materialType) return;
      const type = m.materialType.toLowerCase();
      if (type === "pyq") newStats.pyq += 1;
      else if (type === "assignment") newStats.assignments += 1;
      else if (type === "notes") newStats.notes += 1;
      else if (type === "mst") newStats.mst += 1;
    });
    setStats(newStats);
  };

  // ================= APPROVE / REJECT =================
  const approveMaterial = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await api.put(`/materials/admin/approve/${id}`);
      toast.success("Approved ✅");
      fetchMaterials();
    } catch {
      toast.error("Approval failed ❌");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const rejectMaterial = async (id) => {
    if (!window.confirm("Delete this material permanently?")) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await api.delete(`/materials/admin/${id}`);
      toast.success("Deleted 🗑️");
      fetchMaterials();
    } catch {
      toast.error("Delete failed ❌");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // ================= PIE CHART DATA =================
  const pieData = {
    labels: ["PYQ", "Assignments", "Notes", "MST"],
    datasets: [
      {
        data: [stats.pyq, stats.assignments, stats.notes, stats.mst],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        borderColor: ["#fff", "#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-[#f7f6f3]">
      <AdminSidebar />
      <main className="flex-1 px-10 py-8">
        <Toaster />

        <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

        {/* ================= DASHBOARD GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Materials Stats</h2>
            {stats.pyq + stats.assignments + stats.notes + stats.mst === 0 ? (
              <p className="text-gray-500 text-center mt-16">No materials yet 📂</p>
            ) : (
              <div className="flex-1 min-h-[250px]">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // ✅ makes chart fit container
                  }}
                />
              </div>
            )}
          </div>

          {/* Pending Approvals List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Latest 6 Pending Approvals</h2>

            {loading ? (
              <p>Loading...</p>
            ) : pendingMaterials.length === 0 ? (
              <p className="text-gray-500">No pending approvals 🎉</p>
            ) : (
              pendingMaterials.map((m) => {
                const id = m._id || m.id;
                return (
                  <div
                    key={id}
                    className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    <div>
                      <h2 className="font-semibold truncate">{m.fileName}</h2>
                      <p className="text-sm text-gray-500">
                        {m.subject} • Semester {m.semester} • {m.materialType} • PENDING
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3 md:mt-0">
                      <button
                        onClick={() => approveMaterial(id)}
                        disabled={actionLoading[id]}
                        className="bg-green-600 text-white py-2 px-4 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectMaterial(id)}
                        disabled={actionLoading[id]}
                        className="bg-red-600 text-white py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
