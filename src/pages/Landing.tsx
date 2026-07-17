import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
