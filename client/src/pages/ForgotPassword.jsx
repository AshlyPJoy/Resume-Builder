import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      // Real app: await api.post('/auth/forgot-password', { email });
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Try again.");
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
            Locked out?
            <br />
            <span className="italic text-[#C9A227]">Happens to everyone.</span>
          </h1>

          <p className="text-sm leading-relaxed text-[#F3EFE3]/60 max-w-[34ch]">
            Enter your email and we'll send you a link to set a new password.
          </p>
        </div>

        <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#F3EFE3]/40 tracking-wide">
          PASSWORD RECOVERY
        </span>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[360px]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6552] hover:text-[#201C14] transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Back to sign in
          </button>

          {!sent ? (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
                Reset your password
              </h2>
              <p className="text-sm text-[#6B6552] mb-8">
                We'll email you a secure link. It expires in 30 minutes.
              </p>

              {error && (
                <div className="text-sm text-[#A83E2C] bg-[#A83E2C]/[0.08] border-l-2 border-[#A83E2C] px-3 py-2.5 mb-5">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block font-['IBM_Plex_Mono',monospace] text-xs tracking-wide uppercase text-[#6B6552] mb-2"
                >
                  Email
                </label>
                <div className="flex items-center gap-2.5 border-b-[1.5px] border-[#DED5BC] focus-within:border-[#9C7B1B] pb-2.5 transition-colors">
                  <Mail size={16} className="text-[#6B6552]" />
                  <input
                    id="email"
                    type="email"
                    placeholder="jordan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full bg-transparent outline-none text-sm text-[#201C14] placeholder:text-[#201C14]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#14182B] hover:bg-[#1E2340] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-[#F3EFE3] text-sm font-medium px-5 py-3.5 transition-colors"
              >
                {loading ? "Sending…" : "Send reset link"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          ) : (
            <div>
              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle2 size={22} className="text-emerald-600" />
              </div>
              <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#201C14] mb-1.5">
                Check your email
              </h2>
              <p className="text-sm text-[#6B6552] leading-relaxed">
                If an account exists for <span className="text-[#201C14] font-medium">{email}</span>,
                we've sent a link to reset your password. It expires in 30 minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}