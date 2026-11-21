import AboutHero from "./AboutHero"
import WhyWeAreHere from "./WhyWeAreHere"
import ProcessSteps from "./ProcessSteps"
import AboutCta from "./AboutCta"

// Puts the four About page sections together, in order.
export default function HowItWorks() {
  return (
    <main>
      <AboutHero />
      <WhyWeAreHere />
      <ProcessSteps />
      <AboutCta />
    </main>
  )
}
// 