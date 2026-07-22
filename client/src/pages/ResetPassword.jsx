import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight, FileText, CheckCircle2, XCircle } from "lucide-react";
import api from "../api/axios"
import {  useNavigate } from "react-router-dom";

export default function ResetPassword({ token = "demo-token", onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
       navigate('/login');
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
      onSuccess?.();
    } catch (err) {
      if (err?.response?.status === 400) {
        setInvalidToken(true);
      } else {
        setError(err?.response?.data?.message || "Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            Almost back
            <br />
            <span className="italic text-[#C9A227]">in.</span>
          </h1>

          <p className="text-sm leading-relaxed text-[#F3EFE3]/60 max-w-[34ch]">
            Set a new password to get back to your resumes.
          </p>
        </div>

        <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#F3EFE3]/40 tracking-wide">
          PASSWORD RECOVERY
        </span>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[360px]">
          {invalidToken ? (
            <div>
              <div className="w-11 h-11 rounded-full bg-[#A83E2C]/10 flex items-center justify-center mb-5">
                <XCircle size={22} className="text-[#A83E2C]" />
              </div>
              <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
                Link expired
              </h2>
              <p className="text-sm text-[#6B6552] leading-relaxed mb-6">
                This reset link is invalid or has expired. Request a new one to continue.
              </p>
              <a
                href="#forgot-password"
                className="inline-flex items-center gap-2 bg-[#14182B] hover:bg-[#1E2340] text-[#F3EFE3] text-sm font-medium px-5 py-3.5 transition-colors"
              >
                Request new link
              </a>
            </div>
          ) : done ? (
            <div>
              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle2 size={22} className="text-emerald-600" />
              </div>
              <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
                Password updated
              </h2>
              <p className="text-sm text-[#6B6552] leading-relaxed mb-6">
                Your password has been reset. You can now sign in with your new password.
              </p>
              <a
                href="#login"
                className="inline-flex items-center gap-2 bg-[#14182B] hover:bg-[#1E2340] text-[#F3EFE3] text-sm font-medium px-5 py-3.5 transition-colors"
              >
                Go to sign in
                <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
                Set a new password
              </h2>
              <p className="text-sm text-[#6B6552] mb-8">
                Choose something you haven't used before.
              </p>

              {error && (
                <div className="text-sm text-[#A83E2C] bg-[#A83E2C]/[0.08] border-l-2 border-[#A83E2C] px-3 py-2.5 mb-5">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552] mb-2"
                >
                  New password
                </label>
                <div className="flex items-center gap-2.5 border-b-[1.5px] border-[#DED5BC] focus-within:border-[#9C7B1B] pb-2.5 transition-colors">
                  <Lock size={16} className="text-[#6B6552]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552] mb-2"
                >
                  Confirm password
                </label>
                <div className="flex items-center gap-2.5 border-b-[1.5px] border-[#DED5BC] focus-within:border-[#9C7B1B] pb-2.5 transition-colors">
                  <Lock size={16} className="text-[#6B6552]" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-transparent outline-none text-sm text-[#201C14] placeholder:text-[#201C14]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#14182B] hover:bg-[#1E2340] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-[#F3EFE3] text-sm font-medium px-5 py-3.5 transition-colors"
              >
                {loading ? "Updating…" : "Reset password"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}