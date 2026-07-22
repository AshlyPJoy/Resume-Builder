import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  LogOut,
  Clock,
  MoreVertical,
  Search,
  Sparkles,
  TrendingUp,
  Layers,
} from "lucide-react";
import api from "../api/axios"
import { useNavigate } from "react-router-dom";

// Mock data + simulated fetch so this preview runs standalone.
// Real app: const res = await api.get('/resumes');



const palettes = [
  { grad: "from-violet-500 to-indigo-500", ring: "#7C3AED", chip: "bg-violet-50 text-violet-700" },
  { grad: "from-rose-500 to-orange-400", ring: "#F43F5E", chip: "bg-rose-50 text-rose-700" },
  { grad: "from-teal-400 to-emerald-500", ring: "#0D9488", chip: "bg-teal-50 text-teal-700" },
  { grad: "from-amber-400 to-orange-500", ring: "#D97706", chip: "bg-amber-50 text-amber-700" },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function calculateCompletion(resume) {
  const basicFields = [resume.name, resume.email, resume.phone, resume.location, resume.summary];
  const filledBasic = basicFields.filter(Boolean).length;
  const hasExperience = resume.experience?.length > 0;
  const hasEducation = resume.education?.length > 0;
  const hasSkills = resume.skills?.length > 0;

  const totalChecks = basicFields.length + 3; // +3 for experience/education/skills
  const doneChecks =
    filledBasic + (hasExperience ? 1 : 0) + (hasEducation ? 1 : 0) + (hasSkills ? 1 : 0);

  return Math.round((doneChecks / totalChecks) * 100);
}
function ProgressRing({ percent, color }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#EEF0F4" strokeWidth="4" />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="#374151"
        className="rotate-90"
        style={{ transformOrigin: "20px 20px" }}
      >
        {percent}
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const userName=localStorage.getItem('userName')

  useEffect(() => {
  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes/getAll');
      const withCompletion = (res?.data || []).map((r) => ({
        ...r,
        completion: calculateCompletion(r),
      }));
      setResumes(withCompletion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchResumes();
}, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await api.post('/resumes', {}); navigate(`/builder/${res.data._id}`);
      await new Promise((r) => setTimeout(r, 500));
      const newResume = {
        _id: String(Date.now()),
        title: "Untitled Resume",
        template: "Modern",
        updatedAt: new Date().toISOString(),
        completion: 5,
      };
      setResumes((prev) => [newResume, ...prev]);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/resumes/${id}`);
    setResumes((prev) => prev.filter((r) => r._id !== id));
    setMenuOpenId(null);
  };

  const handleLogout = () => {
     localStorage.removeItem('token'); navigate('/login');
    console.log("logout");
  };

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  const avgCompletion = resumes.length
    ? Math.round(resumes.reduce((sum, r) => sum + r.completion, 0) / resumes.length)
    : 0;

  return (
    <div
      className="min-h-screen bg-[#FAFAFC] font-['Inter',sans-serif] relative overflow-hidden"
      onClick={() => setMenuOpenId(null)}
    >
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 w-96 h-96 bg-rose-300/25 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />

      {/* Top bar */}
      <header className="relative flex items-center justify-between px-6 md:px-12 py-6">
        <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </span>
          ResumeAI
        </span>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </header>

      <main className="relative px-6 md:px-12 pb-16 max-w-6xl mx-auto">
        {/* Hero greeting */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Hey {userName} <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite]">👋</span>
          </h1>
          <p className="text-slate-500 mt-1.5">Let's get you closer to that next offer.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <Layers size={16} className="text-violet-600" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{resumes.length}</div>
            <div className="text-sm text-slate-500">Total resumes</div>
          </div>

          <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <TrendingUp size={16} className="text-teal-600" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{avgCompletion}%</div>
            <div className="text-sm text-slate-500">Avg. completion</div>
          </div>

          <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <Clock size={16} className="text-rose-600" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {resumes[0] ? timeAgo(resumes[0].updatedAt) : "—"}
            </div>
            <div className="text-sm text-slate-500">Last edited</div>
          </div>
        </div>

        {/* Search + create */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your resumes..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 disabled:opacity-60 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus size={16} />
            {creating ? "Creating…" : "New resume"}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-2xl py-20 px-6">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1.5">
              {query ? "No matches found" : "No resumes yet"}
            </h3>
            <p className="text-sm text-slate-500 max-w-[32ch] mb-6">
              {query
                ? "Try a different search term."
                : "Create your first resume and let AI help you write it."}
            </p>
            {!query && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg shadow-violet-500/25 hover:scale-[1.02] transition-all"
              >
                <Plus size={16} />
                Create your first resume
              </button>
            )}
          </div>
        )}

        {/* Resume grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((resume, i) => {
              const palette = palettes[i % palettes.length];
              return (
                <div
                  key={resume._id}
                  onClick={() => console.log(`navigate to /builder/${resume._id}`)}
                  className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient header strip */}
                  <div className={`h-20 bg-gradient-to-br ${palette.grad} relative overflow-hidden`}>
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="absolute right-6 bottom-3 w-10 h-10 bg-white/15 rounded-full" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === resume._id ? null : resume._id);
                      }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {menuOpenId === resume._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-3 top-11 bg-white border border-slate-100 shadow-xl rounded-xl py-1 w-36 z-10"
                      >
                        <button
                          onClick={() => handleDelete(resume._id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left rounded-lg mx-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{resume.title}</h3>
                        <span
                          className={`inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${palette.chip}`}
                        >
                          {resume.template}
                        </span>
                      </div>
                      <ProgressRing percent={resume.completion} color={palette.ring} />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                      <Clock size={11} />
                      Edited {timeAgo(resume.updatedAt)}
                    </div>
                  </div>

                  {/* Hover shine accent */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
      `}</style>
    </div>
  );
}