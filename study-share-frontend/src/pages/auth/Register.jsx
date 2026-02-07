import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
  });

  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!form.email) {
      toast.error("Enter email first");
      return;
    }

    if (timer > 0) return;

    try {
      const res = await api.post("/auth/send-otp", {
        email: form.email,
      });

      toast.success(res.data.message || "OTP sent");
      setOtpSent(true);

      // Start resend timer (30 sec)
      setTimer(30);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ================= REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error("Please agree to Terms & Privacy Policy");
      return;
    }

    if (!otpSent) {
      toast.error("Please verify email with OTP");
      return;
    }

    if (!form.otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      toast.success(res.data.message || "Account created");

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
    bg-gradient-to-br from-[#fdfbf7] via-[#f3ebe2] to-[#e6d5c3]">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl
      border border-[#d6c3b0] rounded-3xl shadow-2xl p-8 space-y-6">

        <h1 className="text-2xl font-bold text-center text-[#4b2e1e]">
          Create a new <span className="text-[#8b5e3c]">StudyHub</span> Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl bg-[#faf7f3]
            border border-[#d6c3b0] outline-none"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl bg-[#faf7f3]
            border border-[#d6c3b0] outline-none"
          />

          {/* OTP */}
          <div className="flex items-center rounded-xl bg-[#faf7f3]
          border border-[#d6c3b0] overflow-hidden">

            <input
              type="text"
              name="otp"
              placeholder="Verification Code"
              value={form.otp}
              onChange={handleChange}
              disabled={!otpSent}
              className="flex-1 px-5 py-3 bg-transparent outline-none"
            />

            <button
              type="button"
              onClick={sendOtp}
              disabled={timer > 0}
              className="px-4 h-full text-sm font-medium
              text-[#8b5e3c] border-l border-[#d6c3b0]"
            >
              {timer > 0 ? `${timer}s` : otpSent ? "Resend" : "Send"}
            </button>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-[#faf7f3]
              border border-[#d6c3b0] outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* TERMS */}
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            I agree to Terms & Privacy Policy
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white
            bg-gradient-to-r from-[#8b5e3c] to-[#6f4e37]"
          >
            {loading ? "Creating Account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm">
          Already a member?{" "}
          <Link to="/login" className="text-[#8b5e3c]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
