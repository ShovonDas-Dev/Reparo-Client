import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import image from "../../Public/artifact-LrJJDLKIS2uN68SgtSjS88Ob.png"






export default function HeroSection({
  eyebrow = "A BETTER WAY TO REPAIR",
  titleLine1 = "Less time broken.",
  titleLine2 = "More time being you.",
  description = "FixMate brings good people and good repairs together. Because fixing the things you love should feel simple, fair, and a little more human.",
  buttonText = "Find your fix",
  buttonHref = "/services",
  imageSrc = {image}, // Replace with your image path
  imageAlt = "Repair technician working on refrigerator",
}) {
  return (
    <section className="relative mx-auto flex max-w-[1200px] flex-col items-center px-4 pt-16 pb-20 text-center transition-colors">
      
      {/* Eyebrow */}
      <span className="text-xs font-semibold tracking-[0.2em] text-[#6b725c] dark:text-[#a3b899]">
        {eyebrow}
      </span>

      {/* Main Heading */}
      <h1 className="mt-4 text-4xl font-normal tracking-tight text-neutral-900 dark:text-white sm:text-6xl md:text-7xl">
        {titleLine1} <br />
        <em className="font-serif italic text-[#4a6b52] dark:text-[#c6f36a]">
          {titleLine2}
        </em>
      </h1>

      {/* Description */}
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        {description}
      </p>

      {/* Action Button */}
      <div className="mt-8">
        <Link
          href={buttonHref}
          className="group inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {buttonText}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Featured Image Container with Rounded Corner */}
      <div className="mt-16 w-full max-w-[1000px] overflow-hidden rounded-tr-[80px] rounded-tl-[12px] rounded-bl-[12px] rounded-br-[12px] shadow-2xl">
        <div className="relative aspect-[16/10] w-full bg-neutral-200 dark:bg-neutral-800">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
          />
        </div>
        <section className="relative mx-auto flex max-w-[900px] flex-col items-center px-4 py-20 text-center transition-colors">
      
      {/* Eyebrow */}
      <span className="text-xs font-semibold tracking-[0.2em] text-[#6b725c] dark:text-[#a3b899]">
        {eyebrow}
      </span>

      {/* Main Heading */}
      <h2 className="mt-4 text-3xl font-normal tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
        {titleLine1} <br />
        <span className="text-neutral-900 dark:text-white">
          {titleLine2}
        </span>
      </h2>

      {/* Description */}
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        {description}
      </p>

    </section>
      </div>

    </section>
  )
}