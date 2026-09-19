import BlogTeaserSection from "@/components/landing/BlogTeaserSection";
import CeremoniesSection from "@/components/landing/CeremoniesSection";
import ClosingSection from "@/components/landing/ClosingSection";
import DashboardSection from "@/components/landing/DashboardSection";
import FaqSection from "@/components/landing/FaqSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import GuestExperienceSection from "@/components/landing/GuestExperienceSection";
import GuestListSection from "@/components/landing/GuestListSection";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import InvitationsSection from "@/components/landing/InvitationsSection";
import PricingSection from "@/components/landing/PricingSection";
import ProgrammeSection from "@/components/landing/ProgrammeSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import SpecsSection from "@/components/landing/SpecsSection";
import UpcomingSection from "@/components/landing/UpcomingSection";

export default function Landing() {
  return (
    // `landing` scopes the one load animation (see src/index.css). Colours and
    // type are the app's own tokens so the site and the product match.
    <div className="landing flex min-h-screen flex-col overflow-x-hidden bg-background selection:bg-primary/30">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CeremoniesSection />
        <InvitationsSection />
        <GuestListSection />
        <GuestExperienceSection />
        <DashboardSection />
        <ProgrammeSection />
        <SpecsSection />
        <UpcomingSection />
        <ReviewsSection />
        <PricingSection />
        <FaqSection />
        <BlogTeaserSection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
}
