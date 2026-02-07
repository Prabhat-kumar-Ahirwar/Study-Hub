export default function MaterialCard({ material }) {
  const fileExtension =
    material.fileName?.split(".").pop()?.toUpperCase() || "FILE";
  const year = material.year || new Date().getFullYear();
  const materialType = material.materialType || "Notes";

  // Badge colors based on file type (light theme)
  const badgeColors = {
    PDF: "bg-[#F1E6DC] text-[#6F4E37]",
    DOCX: "bg-[#E6DED6] text-[#3E2C23]",
    PPT: "bg-[#F7F3EE] text-[#5A4638]",
    XLSX: "bg-[#E6DED6] text-[#5A4638]",
    FILE: "bg-[#F7F3EE] text-[#8B7765]",
  };
  const badgeClass = badgeColors[fileExtension] || badgeColors["FILE"];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E6DED6] shadow-sm hover:shadow-[0_8px_30px_rgba(111,78,55,0.15)] transition flex flex-col justify-between w-full md:w-80">
      
      {/* Title */}
      <h2 className="text-lg font-semibold text-[#3E2C23] truncate">
        {material.fileName || "Untitled"}
      </h2>

      {/* Subject */}
      <p className="text-sm text-[#5A4638] mt-2 truncate">
        {material.subject || "Unknown Subject"}
      </p>

      {/* Semester */}
      <p className="text-sm text-[#8B7765] mb-2">
        Semester {material.semester || "N/A"}
      </p>

      {/* Notes / Year */}
      <div className="flex justify-between text-xs text-[#8B7765] mb-4">
        <span>{materialType}</span>
        <span>{year}</span>
      </div>

      {/* Bottom row */}
      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${badgeClass}`}
        >
          {fileExtension}
        </span>

        <a
          href={`http://localhost:8080/api/materials/download/${material.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#6F4E37] hover:text-[#5A3A28] transition"
        >
          View →
        </a>
      </div>
    </div>
  );
}
