import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Eye } from "lucide-react";
import api from "../api/axios"

// ---------------------------------------------------------
// Sample content used only to render realistic-looking thumbnails.
// Real user data is NOT used here — these are just previews so
// people can see what each layout actually looks like, FlowCV-style.
// ---------------------------------------------------------
const sample = {
  name: "Alex Morgan",
  role: "Senior Product Designer",
  contact: "alex@email.com · (555) 123-4567 · San Francisco, CA",
  summary:
    "Product designer with 6+ years crafting user-centered interfaces for fast-growing startups.",
  experience: [
    { title: "Senior Product Designer", company: "Nimbus Labs", period: "2022 — Present", bullet: "Led redesign of core onboarding flow, lifting activation 24%." },
    { title: "Product Designer", company: "Vantage Co.", period: "2019 — 2022", bullet: "Shipped design system adopted across 12 product teams." },
  ],
  education: [{ degree: "B.A. Design", school: "Parsons School of Design", year: "2019" }],
  skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
};

// Each template renders the SAME sample data, styled differently —
// this is what actually communicates layout differences to a user,
// rather than abstract gray bars.
function ClassicThumb() {
  return (
    <div className="w-full h-full bg-white px-4 py-3.5 overflow-hidden font-['Georgia',serif]">
      <div className="text-[7px] font-bold text-slate-900">{sample.name}</div>
      <div className="text-[5px] text-slate-500 mb-1">{sample.role}</div>
      <div className="text-[4px] text-slate-400 mb-2 border-b border-slate-200 pb-1.5">{sample.contact}</div>
      <div className="text-[4px] text-slate-600 leading-tight mb-2">{sample.summary}</div>
      <div className="text-[4.5px] font-bold uppercase tracking-wide text-slate-800 border-b border-slate-300 mb-1">Experience</div>
      {sample.experience.map((e, i) => (
        <div key={i} className="mb-1.5">
          <div className="flex justify-between text-[4.5px] font-semibold text-slate-800">
            <span>{e.title} — {e.company}</span>
            <span className="text-slate-400 font-normal">{e.period}</span>
          </div>
          <div className="text-[4px] text-slate-500 leading-tight">{e.bullet}</div>
        </div>
      ))}
      <div className="text-[4.5px] font-bold uppercase tracking-wide text-slate-800 border-b border-slate-300 mb-1 mt-2">Education</div>
      <div className="text-[4.5px] text-slate-600">{sample.education[0].degree} — {sample.education[0].school}</div>
    </div>
  );
}

function ModernThumb() {
  return (
    <div className="w-full h-full bg-white flex overflow-hidden font-['Inter',sans-serif]">
      <div className="w-[34%] h-full bg-[#1E2340] px-2.5 py-3.5">
        <div className="w-4 h-4 rounded-full bg-white/25 mb-2" />
        <div className="text-[6px] font-bold text-white">{sample.name}</div>
        <div className="text-[4.5px] text-violet-200 mb-2">{sample.role}</div>
        <div className="text-[4px] text-white/50 leading-tight mb-2">{sample.contact}</div>
        <div className="text-[4.5px] font-bold text-white/80 uppercase mb-1 mt-2">Skills</div>
        {sample.skills.map((s) => (
          <div key={s} className="text-[4px] text-white/60 mb-0.5">{s}</div>
        ))}
      </div>
      <div className="flex-1 px-2.5 py-3.5">
        <div className="text-[4.5px] font-bold uppercase tracking-wide text-violet-600 border-b border-violet-100 mb-1">Experience</div>
        {sample.experience.map((e, i) => (
          <div key={i} className="mb-1.5">
            <div className="text-[4.5px] font-semibold text-slate-800">{e.title}</div>
            <div className="flex justify-between text-[4px] text-slate-400">
              <span>{e.company}</span><span>{e.period}</span>
            </div>
            <div className="text-[4px] text-slate-500 leading-tight">{e.bullet}</div>
          </div>
        ))}
        <div className="text-[4.5px] font-bold uppercase tracking-wide text-violet-600 border-b border-violet-100 mb-1 mt-2">Education</div>
        <div className="text-[4.5px] text-slate-600">{sample.education[0].degree}</div>
      </div>
    </div>
  );
}

function CreativeThumb() {
  return (
    <div className="w-full h-full bg-white overflow-hidden font-['Inter',sans-serif]">
      <div className="h-9 bg-gradient-to-r from-rose-500 to-orange-400 px-3 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-white/40 shrink-0" />
        <div>
          <div className="text-[6px] font-bold text-white leading-none">{sample.name}</div>
          <div className="text-[4.5px] text-white/80">{sample.role}</div>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <div className="text-[4px] text-slate-400 mb-1.5">{sample.contact}</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {sample.skills.map((s) => (
            <span key={s} className="text-[3.5px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
        <div className="text-[4.5px] font-bold uppercase tracking-wide text-rose-500 mb-1">Experience</div>
        {sample.experience.map((e, i) => (
          <div key={i} className="mb-1.5">
            <div className="text-[4.5px] font-semibold text-slate-800">{e.title} · {e.company}</div>
            <div className="text-[4px] text-slate-500 leading-tight">{e.bullet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MinimalThumb() {
  return (
    <div className="w-full h-full bg-white px-5 py-5 flex flex-col justify-center overflow-hidden font-['Inter',sans-serif]">
      <div className="text-center mb-2.5">
        <div className="text-[7px] font-semibold tracking-wide text-slate-900">{sample.name}</div>
        <div className="text-[4.5px] text-slate-400 mt-0.5">{sample.role}</div>
      </div>
      <div className="h-px bg-slate-200 mb-2" />
      <div className="text-[4px] text-slate-500 leading-tight mb-2 text-center">{sample.summary}</div>
      <div className="h-px bg-slate-200 mb-2" />
      {sample.experience.map((e, i) => (
        <div key={i} className="flex justify-between text-[4px] text-slate-600 mb-1">
          <span>{e.title}, {e.company}</span>
          <span className="text-slate-400">{e.period}</span>
        </div>
      ))}
    </div>
  );
}

const templates = [
  { id: "classic", name: "Classic", tag: "ATS-friendly", accent: "#14182B", Thumb: ClassicThumb },
  { id: "modern", name: "Modern", tag: "Sidebar layout", accent: "#7C3AED", Thumb: ModernThumb },
  { id: "creative", name: "Creative", tag: "Design roles", accent: "#F43F5E", Thumb: CreativeThumb },
  { id: "minimal", name: "Minimal", tag: "Maximum whitespace", accent: "#0D9488", Thumb: MinimalThumb },
];

export default function TemplateSelector({ initialTemplate = "classic", onContinue, onBack }) {
  const [selected, setSelected] = useState(initialTemplate);
  const [previewId, setPreviewId] = useState(null);
  const navigate = useNavigate();
  const { id: resumeId } = useParams();
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    setSaving(true);
    try {
      await api.put(`/resumes/${resumeId}`, { template: selected });
      navigate(`/builder/${resumeId}`);
      await new Promise((r) => setTimeout(r, 500));
      onContinue?.(selected);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-['Inter',sans-serif] px-6 md:px-12 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1.5">
          Choose a template
        </h1>
        <p className="text-slate-500 mb-9">
          You can switch templates any time — your content stays the same.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {templates.map((tpl) => {
            const isSelected = selected === tpl.id;
            return (
              <div
                key={tpl.id}
                className={`group relative rounded-2xl border-2 overflow-hidden transition-all duration-200 bg-white cursor-pointer ${
                  isSelected
                    ? "border-violet-500 shadow-lg shadow-violet-500/10 -translate-y-1"
                    : "border-slate-100 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md"
                }`}
                onClick={() => setSelected(tpl.id)}
              >
                <div className="h-56 bg-slate-50 border-b border-slate-100 relative">
                  <tpl.Thumb />

                  {/* Hover overlay, FlowCV-style */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewId(tpl.id);
                      }}
                      className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-slate-50"
                    >
                      <Eye size={13} /> Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(tpl.id);
                      }}
                      className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-violet-700"
                      onClick={handleContinue}
                    >
                      Use this
                    </button>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shadow-sm z-10">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tpl.accent }} />
                    <span className="font-bold text-sm text-slate-900">{tpl.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">{tpl.tag}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-violet-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {saving ? "Saving…" : "Continue with this template"}
            {!saving && <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      {/* Fullscreen preview modal */}
      {previewId && (
        <div
          className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-6"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-sm h-[600px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {templates.find((t) => t.id === previewId)?.Thumb({ full: true })}
            <button
              onClick={() => setPreviewId(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}