import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ConsentScripts } from "@/components/consent/ConsentScripts";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { A11yWidget } from "@/components/a11y/A11yWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "One Tech — Difficile? Non per noi.",
  description:
    "Software, AI e automazioni su misura per il tuo settore. Motori digitali già pronti, cuciti addosso alla tua azienda: online in settimane, non in mesi.",
  icons: { icon: "/one-logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#07060B",
};

/** Restores accessibility preferences before first paint, so there is no flash of the default look. */
const A11Y_BOOT = `try{var p=JSON.parse(localStorage.getItem("onetech-a11y")||"{}"),e=document.documentElement;
if(p.text&&p.text!==100)e.setAttribute("data-a11y-text",String(p.text));
["contrast","underline","spacing","grayscale"].forEach(function(k){if(p[k])e.setAttribute("data-a11y-"+k,"on")});
if(p.motion)e.setAttribute("data-a11y-motion","reduced");}catch(_){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_BOOT }} />
      </head>
      <body>
        <LanguageProvider>
          <A11yWidget>{children}</A11yWidget>
          <WhatsAppButton />
          <CookieBanner />
          <ConsentScripts />
        </LanguageProvider>
      </body>
    </html>
  );
}
