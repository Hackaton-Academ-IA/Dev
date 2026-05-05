import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import ConceptSection from "@/components/landing/ConceptSection";
import CiblesSection from "@/components/landing/CiblesSection";
import TarifsSection from "@/components/landing/TarifsSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="scanlines max-w-[1280px] mx-auto p-4 sm:p-6 space-y-5">
      <NavBar />
      <Hero />
      <ConceptSection />
      <CiblesSection />
      <TarifsSection />
      <LandingFooter />
    </div>
  );
}
