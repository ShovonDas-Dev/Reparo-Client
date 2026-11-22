import * as motion from "framer-motion/client"
import HowItWorks from "@/components/About/HowItWorks"

// About page: Navbar and Footer come from the layout.
const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <HowItWorks />
    </motion.div>
  )
}

export default About
