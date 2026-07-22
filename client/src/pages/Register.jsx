import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, FileText } from "lucide-react";
import api from "../api/axios"

export default function Register({ onSuccess }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('userName', res.data.name);

      localStorage.setItem('token', res.data.token);
      navigate('/');
      await new Promise((resolve) => setTimeout(resolve, 900));
      onSuccess?.(formData);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const firstName = formData.name.trim().split(" ")[0] || "";

  const inputRowBase =
    "flex items-center gap-2.5 border-b-[1.5px] border-[#DED5BC] pb-2.5 transition-colors";
  const inputRowFocused = "border-[#9C7B1B]";
  console.log("formData", formData);
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[1.05fr_1fr] bg-[#F7F3EA] font-['IBM_Plex_Sans',sans-serif]">
      {/* Left panel */}
      <div
        className="relative flex flex-col justify-between px-8 py-12 md:px-14 md:py-16 text-[#F3EFE3] bg-[#14182B]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(201,162,39,0.10), transparent 45%), radial-gradient(circle at 85% 85%, rgba(201,162,39,0.06), transparent 40%)",
        }}
      >
        <div>
          <span className="inline-flex items-center gap-2 font-['IBM_Plex_Mono',monospace] text-xs tracking-[0.18em] uppercase text-[#C9A227]">
            <span className="inline-block w-[18px] h-px bg-[#C9A227]" />
            <FileText size={13} />
            AI Resume Builder
          </span>

          <h1 className="font-['Fraunces',serif] font-medium text-[clamp(2.1rem,3.4vw,3rem)] leading-[1.12] mt-7 mb-3 max-w-[11ch]">
            Your career,
            <br />
            <span className="italic text-[#C9A227]">typeset.</span>
          </h1>

          <p className="text-sm leading-relaxed text-[#F3EFE3]/60 max-w-[34ch]">
            Create an account and watch your resume take shape as you fill it in.
          </p>
        </div>

        {/* Live resume preview — signature element */}
        <div className="relative w-full max-w-[340px] bg-[#F7F3EA] text-[#201C14] rounded-sm px-7 py-6 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)] -rotate-[1.2deg] hover:rotate-0 transition-transform duration-300">
          <span className="absolute top-3.5 right-4 w-2 h-2 rounded-full bg-[#C9A227]" />

          <div className="font-['Fraunces',serif] text-xl font-semibold min-h-[1.7rem] border-b border-[#DED5BC] pb-2 mb-2.5">
            {firstName || <span className="text-[#201C14]/25 font-normal">Your name</span>}
          </div>

          <div className="font-['IBM_Plex_Mono',monospace] text-[0.68rem] tracking-wide uppercase text-[#6B6552] mb-3.5">
            Product Designer · San Francisco
          </div>

          <div className="h-1.5 rounded-sm bg-[#DED5BC] mb-[7px]" style={{ width: "92%" }} />
          <div className="h-1.5 rounded-sm bg-[#DED5BC] mb-[7px]" style={{ width: "78%" }} />
          <div className="h-1.5 rounded-sm bg-[#DED5BC]" style={{ width: "85%" }} />
        </div>

        <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#F3EFE3]/40 tracking-wide">
          002 / DRAFT — UNTITLED RESUME
        </span>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-8 py-12">
        <form className="w-full max-w-[360px]" onSubmit={handleSubmit} noValidate>
          <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
            Create your account
          </h2>
          <p className="text-sm text-[#6B6552] mb-8">
            Start building a resume that gets read.
          </p>

          {error && (
            <div className="text-sm text-[#A83E2C] bg-[#A83E2C]/[0.08] border-l-2 border-[#A83E2C] px-3 py-2.5 mb-5">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="name"
              className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552] mb-2"
            >
              Full name
            </label>
            <div className={`${inputRowBase} ${focusedField === "name" ? inputRowFocused : ""}`}>
              <User
                size={16}
                className={focusedField === "name" ? "text-[#9C7B1B]" : "text-[#6B6552]"}
              />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jordan Rivera"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                autoComplete="name"
                className="w-full bg-transparent outline-none text-sm text-[#201C14] placeholder:text-[#201C14]/30"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552] mb-2"
            >
              Email
            </label>
            <div className={`${inputRowBase} ${focusedField === "email" ? inputRowFocused : ""}`}>
              <Mail
                size={16}
                className={focusedField === "email" ? "text-[#9C7B1B]" : "text-[#6B6552]"}
              />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jordan@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                autoComplete="email"
                className="w-full bg-transparent outline-none text-sm text-[#201C14] placeholder:text-[#201C14]/30"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552] mb-2"
            >
              Password
            </label>
            <div
              className={`${inputRowBase} ${focusedField === "password" ? inputRowFocused : ""}`}
            >
              <Lock
                size={16}
                className={focusedField === "password" ? "text-[#9C7B1B]" : "text-[#6B6552]"}
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                className="w-full bg-transparent outline-none text-sm text-[#201C14] placeholder:text-[#201C14]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-[#6B6552] shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#14182B] hover:bg-[#1E2340] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-[#F3EFE3] text-sm font-medium px-5 py-3.5 mt-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A227] focus-visible:outline-offset-2"
          >
            {loading ? "Creating account…" : "Create account"}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="text-center text-sm text-[#6B6552] mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[#9C7B1B] font-medium hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}