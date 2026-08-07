import LandingNavbar from "@/components/LandingPage/navbar/LandingNavbar";
import HeroSection from "@/components/LandingPage/HeroSection";
import PrecisionSection from "@/components/LandingPage/PrecisionSection";
import SecurityBanner from "@/components/LandingPage/SecurityBanner";
import PersonaSection from "@/components/LandingPage/PersonaSection";
import LandingFooter from "@/components/LandingPage/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-foreground overflow-x-hidden flex flex-col justify-between">
      <LandingNavbar />
      <main className="flex-grow">
        <HeroSection />
        <PrecisionSection />
        <SecurityBanner />
        <PersonaSection />
      </main>
      <LandingFooter />
    </div>
  );
}


