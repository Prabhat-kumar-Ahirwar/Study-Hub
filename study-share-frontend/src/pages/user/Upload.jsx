import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const subjectsBySemester = {
  1: ["Engineering Mathematics-I (BT-101)", "Engineering Physics (BT-102)", "Engineering Chemistry (BT-103)", "Basic Electrical Engineering (BT-104)", "Engineering Graphics", "English for Communication (BT-105)"],
  2: ["Engineering Mathematics-II (BT-201)", "Engineering Chemistry / Physics", "Basic Mechanical Engineering", "Basic Electronics Engineering", "Environmental Studies"],
  3: ["Discrete Structures (CS-302)", "Data Structures (CS-303)", "Digital Systems (CS-304)", "OOP & Methodology (CS-305)", "Energy & Environmental Engineering (ES-301)"],
  4: ["Mathematics-III (BT-401)", "DAA (CS-402)", "Software Engineering (CS-403)", "COA (CS-404)", "Operating Systems (CS-405)"],
  5: ["TOC (CS-501)", "DBMS (CS-502)", "IWT (CS-504)", "Cyber Security", "Minor Project-I"],
  6: ["Machine Learning", "Computer Networks", "Compiler Design", "Knowledge Management"],
  7: ["Distributed System", "Web Engineering", "Elective Subjects", "Project-I"],
  8: ["Cloud Computing", "Data Mining", "Soft Computing", "Project-II"],
};

export default function Upload() {
  const navigate = useNavigate();
  const [materialType, setMaterialType] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toUpperCase();

  useEffect(() => {
    if (!user || !["USER", "ADMIN"].includes(role)) navigate("/");
  }, [user, role, navigate]);

  const handleUpload = async () => {
    if (!materialType || !semester || !subject || !file) return toast.error("Please fill all fields and select a file");
    if (file.type !== "application/pdf") return toast.error("Only PDF files are allowed");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Session expired. Please login again.");

    const formData = new FormData();
    formData.append("materialType", materialType);
    formData.append("semester", Number(semester));
    formData.append("subject", subject);
    formData.append("file", file);
    if (role === "ADMIN") formData.append("autoApprove", "true");

    setLoading(true);
    try {
      await api.post("/materials/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      toast.success(role === "ADMIN" ? "Material uploaded & published successfully ✅" : "Material uploaded! Awaiting admin approval ⏳");

      setMaterialType(""); setSemester(""); setSubject(""); setFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-12 flex items-center justify-center bg-gradient-to-br from-[#fdfbf7] via-[#f3ebe2] to-[#e6d5c3]">
      <Toaster position="top-center" />
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-[#d6c3b0] shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#4b2e1e]">
          Upload <span className="text-[#8b5e3c]">Study Material</span>
        </h2>

        <p className="text-center text-sm sm:text-base text-[#6b4a36] mt-1 sm:mt-2">
          {role === "ADMIN" ? "Admin uploads are published instantly" : "Materials will be reviewed by admin"}
        </p>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 rounded-xl bg-[#faf7f3] border border-[#d6c3b0] text-sm sm:text-base"
          >
            <option value="">Material Type</option>
            <option value="MST">MST Paper</option>
            <option value="Assignment">Assignment</option>
            <option value="PYQ">Previous Year Questions</option>
            <option value="Notes">Notes</option>
          </select>

          <select
            value={semester}
            onChange={(e) => { setSemester(e.target.value); setSubject(""); }}
            className="w-full px-4 py-2 sm:py-3 rounded-xl bg-[#faf7f3] border border-[#d6c3b0] text-sm sm:text-base"
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!semester}
            className="w-full px-4 py-2 sm:py-3 rounded-xl bg-[#faf7f3] border border-[#d6c3b0] text-sm sm:text-base truncate"
          >
            <option value="">{semester ? "Select Subject" : "Select semester first"}</option>
            {subjectsBySemester[semester]?.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
          </select>

          <input type="file" id="fileUpload" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          <label
            htmlFor="fileUpload"
            className="inline-flex items-center justify-center w-full px-4 py-3 sm:py-3 rounded-xl cursor-pointer font-medium text-white bg-gradient-to-r from-[#8b5e3c] to-[#6f4e37] text-sm sm:text-base truncate"
          >
            {file ? "Change File" : "Select PDF File"}
          </label>

          {file && <p className="text-sm sm:text-base truncate text-[#6b4a36]">📄 {file.name}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-6 sm:mt-8 py-3 sm:py-3 rounded-full font-semibold text-white transition text-sm sm:text-base ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#8b5e3c] to-[#6f4e37] hover:scale-105"
          }`}
        >
          {loading ? "Uploading..." : "Upload Material"}
        </button>
      </div>
    </div>
  );
}
