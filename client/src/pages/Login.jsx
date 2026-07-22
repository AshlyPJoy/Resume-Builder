import  { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, FileText } from "lucide-react";
import api from "../api/axios"
import { useNavigate } from "react-router-dom";

export default function Login({ onSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
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

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Real app:
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);

      navigate('/');
      await new Promise((resolve) => setTimeout(resolve, 900));
      onSuccess?.(formData);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const inputRowBase =
    "flex items-center gap-2.5 border-b-[1.5px] border-[#DED5BC] pb-2.5 transition-colors";
  const inputRowFocused = "border-[#9C7B1B]";

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

          <h1 className="font-['Fraunces',serif] font-medium text-[clamp(2.1rem,3.4vw,3rem)] leading-[1.12] mt-7 mb-3 max-w-[12ch]">
            Pick up where
            <br />
            <span className="italic text-[#C9A227]">you left off.</span>
          </h1>

          <p className="text-sm leading-relaxed text-[#F3EFE3]/60 max-w-[34ch]">
            Sign in to keep editing your resumes and pick up any draft in progress.
          </p>
        </div>

        {/* Static document card — quieter than Register's live preview, since nothing to react to here */}
        <div className="relative w-full max-w-[340px] bg-[#F7F3EA] text-[#201C14] rounded-sm px-7 py-6 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)] -rotate-[1.2deg] hover:rotate-0 transition-transform duration-300">
          <span className="absolute top-3.5 right-4 w-2 h-2 rounded-full bg-[#C9A227]" />

          <div className="font-['IBM_Plex_Mono',monospace] text-[0.68rem] tracking-wide uppercase text-[#6B6552] mb-3.5">
            Recently edited
          </div>

          <div className="flex items-center justify-between border-b border-[#DED5BC] pb-2.5 mb-2.5">
            <span className="font-['Fraunces',serif] text-base">Frontend Engineer</span>
            <span className="font-['IBM_Plex_Mono',monospace] text-[0.65rem] text-[#6B6552]">2d ago</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#DED5BC] pb-2.5 mb-2.5">
            <span className="font-['Fraunces',serif] text-base">Product Designer</span>
            <span className="font-['IBM_Plex_Mono',monospace] text-[0.65rem] text-[#6B6552]">1w ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Fraunces',serif] text-base text-[#201C14]/40">Untitled draft</span>
            <span className="font-['IBM_Plex_Mono',monospace] text-[0.65rem] text-[#6B6552]">3w ago</span>
          </div>
        </div>

        <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#F3EFE3]/40 tracking-wide">
          WELCOME BACK
        </span>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-8 py-12">
        <form className="w-full max-w-[360px]" onSubmit={handleSubmit} noValidate>
          <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
            Sign in
          </h2>
          <p className="text-sm text-[#6B6552] mb-8">
            Welcome back — let's finish that resume.
          </p>

          {error && (
            <div className="text-sm text-[#A83E2C] bg-[#A83E2C]/[0.08] border-l-2 border-[#A83E2C] px-3 py-2.5 mb-5">
              {error}
            </div>
          )}

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

          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552]"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs text-[#9C7B1B] hover:underline font-['IBM_Plex_Sans',sans-serif]"
              >
                Forgot?
              </a>
            </div>
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
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                autoComplete="current-password"
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
            className="w-full flex items-center justify-center gap-2 bg-[#14182B] hover:bg-[#1E2340] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-[#F3EFE3] text-sm font-medium px-5 py-3.5 mt-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A227] focus-visible:outline-offset-2"
          >
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="text-center text-sm text-[#6B6552] mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-[#9C7B1B] font-medium hover:underline">
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
