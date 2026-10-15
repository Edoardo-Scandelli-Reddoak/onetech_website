import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProblemPicker } from "@/components/ProblemPicker";
import { Engines } from "@/components/Engines";
import { TailorLab } from "@/components/TailorLab";
import { Method } from "@/components/Method";
import { Contact } from "@/components/Contact";
import { YouAreHere } from "@/components/YouAreHere";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <ProblemPicker />
        <Engines />
        <TailorLab />
        <Method />
        <Contact />
      </main>
      <YouAreHere />
    </>
  );
}
