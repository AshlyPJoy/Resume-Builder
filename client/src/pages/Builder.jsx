import  { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Check,
  Loader2,
  Tag,
  X,
  Download,
  Palette,
} from "lucide-react";
import { templateComponents } from "./TemplateRegistery";
import api from "../api/axios"
import { useNavigate, useParams } from 'react-router-dom';

// inside the component

// ---------------------------------------------------------
// Empty shapes for new array entries. Each gets a local-only
// `_key` so React can track it in a list before it has a real
// database _id (that only exists after saving).
// ---------------------------------------------------------
const emptyExperience = () => ({
  _key: crypto.randomUUID(),
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

const emptyEducation = () => ({
  _key: crypto.randomUUID(),
  degree: "",
  university: "",
  location: "",
  yearofpassing: "",
});

const initialResume = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  template: "classic",
};

// Small reusable input, styled once instead of repeating classes everywhere
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
      />
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-violet-600" />
      </span>
      <div>
        <h2 className="font-bold text-slate-900 text-sm">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Builder() {
  const [resume, setResume] = useState(initialResume);
  const [skillInput, setSkillInput] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const isFirstLoad = useRef(true);
  const navigate = useNavigate();
  const { id: resumeId } = useParams();
  // ---- Load existing resume on mount ----
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resumes/${resumeId}`); setResume({ ...initialResume, ...res.data });
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  // ---- Autosave: debounced, fires ~900ms after the user stops typing ----
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setSaveState("saving");
    const timeout = setTimeout(async () => {
      try {
        await api.put(`/resumes/${resumeId}`, resume);
        await new Promise((r) => setTimeout(r, 400));
        setSaveState("saved");
      } catch (err) {
        console.error(err);
      }
    }, 900);
    return () => clearTimeout(timeout);
  }, [resume, resumeId]);

  // ---- Simple field updates ----
  const updateField = (field, value) => setResume((prev) => ({ ...prev, [field]: value }));

  // ---- Experience array helpers ----
  const addExperience = () =>
    setResume((prev) => ({ ...prev, experience: [...prev.experience, emptyExperience()] }));

  const updateExperience = (key, field, value) =>
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp._key === key ? { ...exp, [field]: value } : exp
      ),
    }));

  const removeExperience = (key) =>
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp._key !== key),
    }));

  // ---- Education array helpers ----
  const addEducation = () =>
    setResume((prev) => ({ ...prev, education: [...prev.education, emptyEducation()] }));

  const updateEducation = (key, field, value) =>
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu._key === key ? { ...edu, [field]: value } : edu
      ),
    }));

  const removeEducation = (key) =>
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu._key !== key),
    }));

  // ---- Skills (simple string array, add on Enter) ----
  const addSkill = (e) => {
    if (e.key !== "Enter" || !skillInput.trim()) return;
    e.preventDefault();
    if (resume.skills.includes(skillInput.trim())) {
      setSkillInput("");
      return;
    }
    setResume((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  // ---- AI summary generation ----
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await api.post('/ai/generate-summary', {
       jobTitle: resume.experience[0]?.title || "professional",
       experience: resume.experience.map(e => e.description).join(" "),
       skills: resume.skills,
       });
      updateField("summary", res.data.summary);
      await new Promise((r) => setTimeout(r, 1000));
      updateField(
        "summary",
        `Results-driven ${resume.experience[0]?.title || "professional"} with hands-on experience in ${
          resume.skills.slice(0, 3).join(", ") || "modern tools and technologies"
        }. Known for delivering reliable, well-tested work and collaborating effectively across teams.`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // ---- PDF download ----
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/resumes/${resumeId}/export`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.name || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      await new Promise((r) => setTimeout(r, 900));
      console.log("PDF would download here in the real app");
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <Loader2 size={22} className="animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-['Inter',sans-serif]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur border-b border-slate-100">
        <button className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium">
            {saveState === "saving" && (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Loader2 size={13} className="animate-spin" /> Saving…
              </span>
            )}
            {saveState === "saved" && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600">
                <Check size={13} /> Saved
              </span>
            )}
          </div>

         <button
  onClick={() => navigate(`/builder/${resumeId}/template`)}
  className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
>
  <Palette size={13} />
  Change template
</button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {downloading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            {downloading ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* ============ LEFT: FORM ============ */}
        <div className="px-6 md:px-10 py-8 max-w-2xl w-full mx-auto lg:mx-0 space-y-10">
          {/* Personal info */}
          <section>
            <SectionHeader icon={User} title="Personal info" subtitle="How employers reach you" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full name"
                value={resume.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Jordan Rivera"
              />
              <Field
                label="Email"
                type="email"
                value={resume.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="jordan@email.com"
              />
              <Field
                label="Phone"
                value={resume.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 555 123 4567"
              />
              <Field
                label="Location"
                value={resume.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
              <div className="sm:col-span-2">
                <Field
                  label="LinkedIn / Portfolio"
                  value={resume.linkedin}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/jordanrivera"
                />
              </div>
            </div>
          </section>

          {/* Summary */}
          <section>
            <SectionHeader icon={Sparkles} title="Summary" subtitle="A short professional pitch" />
            <textarea
              value={resume.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              rows={4}
              placeholder="Frontend engineer with 4 years building fast, accessible web apps…"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
            />
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50 transition-colors"
            >
              {generatingSummary ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              {generatingSummary ? "Generating…" : "Generate with AI"}
            </button>
          </section>

          {/* Experience */}
          <section>
            <SectionHeader icon={Briefcase} title="Experience" subtitle="Your work history" />
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp._key} className="bg-white border border-slate-200 rounded-xl p-4 relative">
                  <button
                    onClick={() => removeExperience(exp._key)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <Field
                      label="Job title"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp._key, "title", e.target.value)}
                      placeholder="Frontend Engineer"
                    />
                    <Field
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp._key, "company", e.target.value)}
                      placeholder="Acme Inc."
                    />
                    <Field
                      label="Start date"
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp._key, "startDate", e.target.value)}
                    />
                    <Field
                      label="End date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp._key, "endDate", e.target.value)}
                      placeholder="Present"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp._key, "description", e.target.value)}
                      rows={3}
                      placeholder="Built and shipped X, improved Y by Z%…"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                <Plus size={15} /> Add experience
              </button>
            </div>
          </section>

          {/* Education */}
          <section>
            <SectionHeader icon={GraduationCap} title="Education" />
            <div className="space-y-4">
              {console.log(resume.education.map(e => ({ key: e._key, degree: e.degree, year: e.yearofpassing })))}
              {resume.education.map((edu) => (
                <div key={edu._key} className="bg-white border border-slate-200 rounded-xl p-4 relative">
                  <button
                    onClick={() => removeEducation(edu._key)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <Field
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu._key, "degree", e.target.value)}
                      placeholder="B.S. Computer Science"
                    />
                    <Field
                      label="University"
                      value={edu.university}
                      onChange={(e) => updateEducation(edu._key, "university", e.target.value)}
                      placeholder="State University"
                    />
                    <Field
                      label="Year of passing"
                      type="number"
                      value={edu.yearofpassing}
                      onChange={(e) => updateEducation(edu._key, "yearofpassing", e.target.value)}
                      placeholder="2023"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addEducation}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                <Plus size={15} /> Add education
              </button>
            </div>
          </section>

          {/* Skills */}
          <section className="pb-10">
            <SectionHeader icon={Tag} title="Skills" subtitle="Press Enter to add" />
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              placeholder="Type a skill and press Enter…"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-xs font-medium pl-3 pr-2 py-1.5 rounded-full"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-violet-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* ============ RIGHT: LIVE PREVIEW ============ */}
        <div className="bg-slate-100 border-l border-slate-200 px-6 md:px-10 py-8">
          <div className="lg:sticky lg:top-20">
            <div className="bg-white rounded-sm shadow-xl mx-auto max-w-[560px] px-10 py-10 min-h-[600px] overflow-hidden">
              {/*
                Renders whichever template is selected in resume.template
                (classic / modern / creative / minimal). Same resume data
                goes in every time — only the layout component changes.
                Falls back to Classic if resume.template is missing/unknown.
              */}
              {(() => {
                const TemplateComponent =
                  templateComponents[resume.template] || templateComponents.classic;
                return <TemplateComponent resume={resume} />;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}