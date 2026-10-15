import type { Problem } from "@/lib/i18n/dictionaries";

const PATHS: Record<Problem["icon"], React.ReactNode> = {
  doc: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h11v8H8l-4 3z" />
      <path d="M15 9h5v8l-3-2h-6v-2" />
    </>
  ),
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  loan: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  needle: (
    <>
      <path d="M5 19 19 5" />
      <path d="M16 5h3v3" />
      <path d="M8 8c-3 0-4 4-1 5s2 5-1 5" />
    </>
  ),
};

export function ProblemIcon({ name }: { name: Problem["icon"] }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
