"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * The only place tracking scripts are allowed to live.
 * Nothing is rendered (so nothing is downloaded) until the visitor opts in to "analytics".
 */
export function ConsentScripts() {
  const consent = useConsent();
  if (!consent?.analytics || !GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
