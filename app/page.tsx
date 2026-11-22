import * as motion from "framer-motion/client";
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
      {/* Single page entrance; each section already animates its own content. */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <HeroSection/>
        <ServiceCaregorise/>
        <FeaturedService/>
        <HowItWorks/>
        <PromiseSection/>
        <TestimonialsSection/>
        <CtaSection/>
      </motion.main>
      {/* <Footer/> */}
    </>
  );
}
