import CtaSection from "@/components/Home/cta-section";
import Footer from "@/components/Footer/footer";
import HeroSection from "@/components/Home/Hero-Section/page";
import HowItWorks from "@/components/Home/HowItWorks";
import PromiseSection from "@/components/Home/promise-section";
import ServiceCaregorise from "@/components/Home/ServiceCategories/ServiceCaregorise";
import TestimonialsSection from "@/components/Home/testimonials-section";
import FeaturedService from "@/components/Home/FeaturedService";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection/>
        <ServiceCaregorise/>
        <FeaturedService/>
        <HowItWorks/>
        <PromiseSection/>
        <TestimonialsSection/>
        <CtaSection/>
      </main>
      {/* <Footer/> */}
    </>
  );
}
