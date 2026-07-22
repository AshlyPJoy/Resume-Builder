
import { ClassicResume, ModernResume, CreativeResume, MinimalResume } from "./ResumeTemplate";

// Lookup so Builder.jsx can pick the right template component by
// resume.template (a plain string saved on the resume document).
// Kept in its own file (not inside ResumeTemplates.jsx) so that file
// only exports components — required for Vite Fast Refresh to work
// cleanly. See: react-refresh/only-export-components
export const templateComponents = {
  classic: ClassicResume,
  modern: ModernResume,
  creative: CreativeResume,
  minimal: MinimalResume,
};