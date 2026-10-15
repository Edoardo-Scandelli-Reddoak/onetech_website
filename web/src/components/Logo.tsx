import { LOGO_PATH } from "@/lib/content";

export function Logo({ size = 24, color = "var(--violet)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={(size * 400) / 411} viewBox="0 0 411 400" aria-hidden>
      <path fill={color} fillRule="evenodd" clipRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}
