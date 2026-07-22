
// ---------------------------------------------------------
// Each of these renders a FULL-SIZE resume using real data
// from your `resume` state object (same shape as Builder.jsx uses:
// name, email, phone, location, linkedin, summary,
// experience[], education[], skills[]).
//
// They all show the same content — only layout/styling differs.
// This is what makes "pick a template" actually change how the
// resume looks, instead of just saving a label.
// ---------------------------------------------------------

const contactLine = (resume) =>
  [resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean);

export function ClassicResume({ resume }) {
  return (
    <div className="font-['Georgia',serif] text-slate-900">
      <h1 className="text-3xl font-bold">
        {resume.name || <span className="text-slate-300">Your Name</span>}
      </h1>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-2 border-b border-slate-200 pb-3">
        {contactLine(resume).length ? (
          contactLine(resume).map((item, i) => <span key={i}>{item}</span>)
        ) : (
          <span className="text-slate-300">email · phone · location</span>
        )}
      </div>

      {resume.summary && (
        <p className="text-sm text-slate-700 leading-relaxed mt-4">{resume.summary}</p>
      )}

      {resume.experience?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1.5 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp._key || exp._id}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">
                    {exp.title || "Job title"}
                    {exp.company && <span className="font-normal text-slate-500"> — {exp.company}</span>}
                  </span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {exp.startDate} {exp.startDate && "–"} {exp.endDate || "Present"}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.education?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1.5 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu._key || edu._id} className="flex items-baseline justify-between gap-2">
                <span className="text-sm">
                  {edu.degree || "Degree"}
                  {edu.university && <span className="text-slate-500"> — {edu.university}</span>}
                </span>
                <span className="text-xs text-slate-400">{edu.yearofpassing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.skills?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1.5 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((skill) => (
              <span key={skill} className="text-xs bg-slate-100 px-2.5 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ModernResume({ resume }) {
  return (
    <div className="font-['Inter',sans-serif] flex -m-10 min-h-[600px]">
      {/* Sidebar */}
      <div className="w-[36%] bg-[#1E2340] text-white px-6 py-10">
        <div className="w-14 h-14 rounded-full bg-white/15 mb-4" />
        <h1 className="text-xl font-bold leading-tight">
          {resume.name || <span className="text-white/30">Your Name</span>}
        </h1>
        <div className="flex flex-col gap-1 text-xs text-white/50 mt-4">
          {contactLine(resume).length ? (
            contactLine(resume).map((item, i) => <span key={i}>{item}</span>)
          ) : (
            <span className="text-white/25">email · phone · location</span>
          )}
        </div>

        {resume.skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wide text-white/70 mb-2">Skills</h2>
            <div className="flex flex-col gap-1.5">
              {resume.skills.map((skill) => (
                <span key={skill} className="text-xs text-white/70">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {resume.education?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wide text-white/70 mb-2">Education</h2>
            <div className="flex flex-col gap-2">
              {resume.education.map((edu) => (
                <div key={edu._key || edu._id} className="text-xs text-white/70">
                  <div className="font-medium">{edu.degree || "Degree"}</div>
                  <div className="text-white/40">{edu.university} {edu.yearofpassing && `· ${edu.yearofpassing}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main column */}
      <div className="flex-1 px-8 py-10">
        {resume.summary && (
          <p className="text-sm text-slate-700 leading-relaxed mb-6">{resume.summary}</p>
        )}

        {resume.experience?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-violet-600 border-b border-violet-100 pb-1.5 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp._key || exp._id}>
                  <div className="font-semibold text-sm text-slate-900">{exp.title || "Job title"}</div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} {exp.startDate && "–"} {exp.endDate || "Present"}</span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CreativeResume({ resume }) {
  return (
    <div className="font-['Inter',sans-serif] -m-10 min-h-[600px]">
      <div className="bg-gradient-to-r from-rose-500 to-orange-400 px-8 py-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/30 shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {resume.name || <span className="text-white/40">Your Name</span>}
          </h1>
          <div className="text-sm text-white/80 mt-1">
            {contactLine(resume).join(" · ") || "email · phone · location"}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {resume.summary && (
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{resume.summary}</p>
        )}

        {resume.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {resume.skills.map((skill) => (
              <span key={skill} className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        {resume.experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-rose-500 mb-3">Experience</h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp._key || exp._id}>
                  <div className="font-semibold text-sm text-slate-900">
                    {exp.title || "Job title"} {exp.company && `· ${exp.company}`}
                  </div>
                  <div className="text-xs text-slate-400">
                    {exp.startDate} {exp.startDate && "–"} {exp.endDate || "Present"}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.education?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-rose-500 mb-3">Education</h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu._key || edu._id} className="flex justify-between text-sm">
                  <span>{edu.degree || "Degree"} {edu.university && `— ${edu.university}`}</span>
                  <span className="text-slate-400 text-xs">{edu.yearofpassing}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MinimalResume({ resume }) {
  return (
    <div className="font-['Inter',sans-serif] text-center">
      <h1 className="text-2xl font-semibold tracking-wide text-slate-900">
        {resume.name || <span className="text-slate-300">Your Name</span>}
      </h1>
      <div className="text-xs text-slate-400 mt-1">
        {contactLine(resume).join("  ·  ") || "email · phone · location"}
      </div>

      <div className="h-px bg-slate-200 my-5" />

      {resume.summary && (
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-5">{resume.summary}</p>
      )}

      {resume.experience?.length > 0 && (
        <div className="text-left max-w-md mx-auto mb-5">
          {resume.experience.map((exp) => (
            <div key={exp._key || exp._id} className="flex justify-between text-sm text-slate-700 mb-1.5">
              <span>{exp.title || "Job title"}{exp.company && `, ${exp.company}`}</span>
              <span className="text-slate-400 text-xs whitespace-nowrap">
                {exp.startDate} {exp.startDate && "–"} {exp.endDate || "Present"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-slate-200 my-5" />

      {resume.education?.length > 0 && (
        <div className="text-left max-w-md mx-auto mb-5">
          {resume.education.map((edu) => (
            <div key={edu._key || edu._id} className="flex justify-between text-sm text-slate-700">
              <span>{edu.degree || "Degree"}, {edu.university}</span>
              <span className="text-slate-400 text-xs">{edu.yearofpassing}</span>
            </div>
          ))}
        </div>
      )}

      {resume.skills?.length > 0 && (
        <div className="text-xs text-slate-500">{resume.skills.join("  ·  ")}</div>
      )}
    </div>
  );
}