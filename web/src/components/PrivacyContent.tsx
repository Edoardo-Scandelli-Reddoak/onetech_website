"use client";

import Link from "next/link";
import { openCookiePreferences } from "@/lib/consent";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PRIVACY } from "@/lib/i18n/privacy";
import styles from "./PrivacyContent.module.css";

export function PrivacyContent() {
  const { locale } = useLanguage();
  const p = PRIVACY[locale];

  return (
    <article className={`container ${styles.page}`}>
      <header className={styles.head}>
        <h1>{p.title}</h1>
        <p className={styles.updated}>{p.updated}</p>
        <p className={styles.intro}>{p.intro}</p>
        <button type="button" className="btn btn-primary" onClick={openCookiePreferences}>
          {p.manage}
        </button>
      </header>

      <nav className={styles.toc} aria-label={p.title}>
        <ol>
          {p.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.sections}>
        {p.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
            <h2 id={`${s.id}-h`}>{s.title}</h2>
            {s.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {s.table && (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      {s.table.head.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) =>
                          i === 0 ? (
                            <th key={i} scope="row">
                              <code>{cell}</code>
                            </th>
                          ) : (
                            // data-label shows the column name when the table collapses into cards on phones.
                            <td key={i} data-label={s.table!.head[i]}>
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      <footer className={styles.foot}>
        <Link href="/" className="btn btn-ghost">
          ← {p.back}
        </Link>
        <p className={styles.note}>{p.draftNote}</p>
      </footer>
    </article>
  );
}
