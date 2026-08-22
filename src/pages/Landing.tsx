import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import ProductShowcase from "@/components/landing/ProductShowcase";
import SocialProofSection from "@/components/landing/SocialProofSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30 overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SocialProofSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProductShowcase />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
