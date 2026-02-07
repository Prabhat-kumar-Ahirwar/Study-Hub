import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialCard from "../../components/common/MaterialCard";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import Navbar from "../../components/common/Navbar";
import { FaLinkedin, FaGithub, FaEnvelope, FaGlobe } from "react-icons/fa";


export default function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch materials
  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await fetch("http://localhost:8080/api/materials");
        const data = await response.json();
        setMaterials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  const features = [
    {
      title: "Smarter Learning",
      desc: "Access structured notes, PYQs, assignments & MST papers.",
    },
    {
      title: "Admin Verified",
      desc: "Every material is reviewed and approved for quality.",
    },
    {
      title: "Fast & Simple",
      desc: "Search by subject, semester, or type in seconds.",
    },
  ];

  /* ===== Animations ===== */
  const fadeSlideLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeUpSoft = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#F7F3EE] to-[#F1E6DC] text-[#3E2C23] overflow-x-hidden">
      <Navbar user={user} setUser={setUser} />

      {/* ================= HERO ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24 sm:pb-32">
        <Particles
          className="absolute inset-0 -z-10"
          options={{
            particles: {
              number: { value: 40 },
              size: { value: 3 },
              move: { speed: 1 },
              color: { value: ["#6F4E37", "#A47148"] },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "repulse" } },
            },
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <motion.div
            variants={fadeSlideLeft}
            initial="hidden"
            animate="visible"
            className="text-center md:text-left"
          >
            <span className="inline-block mb-4 px-4 py-1 text-xs sm:text-sm rounded-full bg-[#F1E6DC] border border-[#E6DED6] text-[#6F4E37]">
              📚 Smart study materials for CSE students
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Turn learning into <br />
              <span className="text-[#6F4E37]">success. Instantly.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#5A4638] max-w-xl mx-auto md:mx-0">
              Discover, upload, and access verified BTech CSE study materials —
              curated by students and approved by admins.
            </p>

            <p className="mt-3 text-xs sm:text-sm text-[#8B7765] italic">
              ⚠️ Currently available only for <strong>BTech CSE</strong>
            </p>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/materials")}
                className="px-7 py-3 rounded-full bg-[#6F4E37] text-white font-semibold hover:bg-[#5A3A28] transition"
              >
                Explore Materials
              </button>

              {user ? (
                isAdmin ? (
                  <button
                    onClick={() => navigate("/admin/upload")}
                    className="px-7 py-3 rounded-full border border-[#6F4E37] text-[#6F4E37] font-semibold hover:bg-[#F1E6DC] transition"
                  >
                    Admin Upload
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/upload")}
                    className="px-7 py-3 rounded-full border border-[#6F4E37] text-[#6F4E37] hover:bg-[#F1E6DC] transition"
                  >
                    Upload Material
                  </button>
                )
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-3 rounded-full border border-[#6F4E37] text-[#6F4E37] hover:bg-[#F1E6DC] transition"
                >
                  Login to Upload
                </button>
              )}
            </div>
          </motion.div>

          {/* RIGHT GLOW */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 rounded-full bg-[#6F4E37] blur-[120px] opacity-10"></div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUpSoft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white border border-[#E6DED6] rounded-2xl p-6 text-center sm:text-left hover:shadow-[0_8px_30px_rgba(111,78,55,0.15)] transition"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {f.title}
              </h3>
              <p className="text-[#5A4638] text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= LATEST MATERIALS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[#8c6754] text-center sm:text-left">
          Latest Materials
        </h2>

        {loading ? (
          <p className="text-[#8B7765] text-center">Loading materials...</p>
        ) : materials.length === 0 ? (
          <p className="text-[#8B7765] text-center">
            No materials available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {materials
              .slice(-6)
              .reverse()
              .map((m, i) => (
                <motion.div
                  key={m.id}
                  custom={i}
                  variants={fadeUpSoft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <MaterialCard material={m} />
                </motion.div>
              ))}
          </div>
        )}
      </section>

    
{/* ================= FOOTER ================= */}
<footer className="border-t border-[#E6DED6] bg-[#F7F3EE]">
  <div className="max-w-7xl mx-auto px-6 py-10 text-center space-y-4 sm:space-y-6">

    {/* Links with icons */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
      <a
        href="https://www.linkedin.com/in/prabhat-ahirwar-24604033a"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#8B7765] hover:text-[#6F4E37] transition-colors"
      >
        <FaLinkedin size={18} /> LinkedIn
      </a>
      <a
        href="https://github.com/Prabhat-kumar-Ahirwar"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#8B7765] hover:text-[#6F4E37] transition-colors"
      >
        <FaGithub size={18} /> GitHub
      </a>
      <a
        href="https://prabhatportfolioka.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#8B7765] hover:text-[#6F4E37] transition-colors"
      >
        <FaGlobe size={18} /> Portfolio
      </a>
      <a
        href="mailto:m2gprabhat@gmail.com"
        className="flex items-center gap-2 text-[#8B7765] hover:text-[#6F4E37] transition-colors"
      >
        <FaEnvelope size={18} /> Email
      </a>
    </div>

    {/* Copyright */}
    <p className="text-[#8B7765] text-xs sm:text-sm mt-2">
      © {new Date().getFullYear()} StudyShare. All rights reserved.
    </p>
  </div>
</footer>

    </div>
  );
}
