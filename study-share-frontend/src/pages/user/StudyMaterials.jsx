import { useEffect, useState } from "react";
import api from "../../api/axios";
import MaterialCard from "../../components/common/MaterialCard";

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [semester, setSemester] = useState("");

  // ===== Pagination =====
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // ===== Fetch materials =====
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get("/materials");
        setMaterials(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch materials", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // ===== Reset page on filter change =====
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, semester]);

  // ===== Filtering =====
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.materialType.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || m.materialType === category;
    const matchesSemester = semester === "" || m.semester === Number(semester);

    return matchesSearch && matchesCategory && matchesSemester;
  });

  // ===== Pagination logic =====
  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-12 text-[#3E2C23]
      bg-gradient-to-br from-[#FFFFFF] via-[#F7F3EE] to-[#F1E6DC]">
      
      {/* ===== Heading ===== */}
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3E2C23]">
          Study <span className="text-[#6F4E37]">Materials</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-[#5A4638] text-sm sm:text-base">
          Search MST papers, assignments, PYQs and notes
        </p>
      </section>

      {/* ===== Filters ===== */}
      <section className="max-w-5xl mx-auto mt-8 sm:mt-12">
        <div className="rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6
          bg-white border border-[#E6DED6] shadow-sm">
          
          <input
            type="text"
            placeholder="Search by subject or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-[#F7F3EE]
              border border-[#E6DED6] placeholder-[#8B7765]
              text-[#3E2C23] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-[#F7F3EE]
              border border-[#E6DED6] text-[#3E2C23]
              focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          >
            <option value="">All Types</option>
            <option value="MST">MST Papers</option>
            <option value="Assignment">Assignments</option>
            <option value="PYQ">Previous Year Questions</option>
            <option value="Notes">Notes</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-[#F7F3EE]
              border border-[#E6DED6] text-[#3E2C23]
              focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ===== Materials Grid ===== */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16">
        {loading ? (
          <p className="text-center text-[#8B7765]">Loading materials...</p>
        ) : paginatedMaterials.length === 0 ? (
          <p className="text-center text-[#8B7765]">No materials found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {paginatedMaterials.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>

            {/* ===== Pagination Controls ===== */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 sm:px-4 py-2 rounded-lg border
                    text-[#3E2C23] disabled:opacity-40 hover:bg-[#F1E6DC]"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 sm:px-4 py-2 rounded-lg border
                      ${
                        currentPage === i + 1
                          ? "bg-[#6F4E37] text-white"
                          : "hover:bg-[#F1E6DC]"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 sm:px-4 py-2 rounded-lg border
                    text-[#3E2C23] disabled:opacity-40 hover:bg-[#F1E6DC]"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
