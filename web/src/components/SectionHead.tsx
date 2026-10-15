import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

type Props = {
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "dark" | "light";
};

/** Consistent section header: title and optional intro. */
export function SectionHead({ title, intro, id, tone = "dark" }: Props) {
  return (
    <header className={styles.head} data-tone={tone}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {intro && <p className={styles.intro}>{intro}</p>}
    </header>
  );
}
