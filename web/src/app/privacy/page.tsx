import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PrivacyContent } from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy e cookie — One Tech",
  description: "Come One Tech tratta i dati del modulo contatti e quali cookie usa il sito.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <PrivacyContent />
      </main>
    </>
  );
}
