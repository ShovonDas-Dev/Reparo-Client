import Image from "next/image"
import { ShieldCheck, Star, Wrench } from "lucide-react"

// Shared layout for /sign-in and /sign-up:
// left side = photo with overlay (desktop only), right side = the form page.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-[calc(100vh-79px)] flex-1 lg:grid-cols-2">
      {/* left visual panel — hidden on small screens */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/artifact-LrJJDLKIS2uN68SgtSjS88Ob.png"
          alt="A Reparo technician checking a refrigerator with a tablet"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="inline-flex items-center gap-2.5 text-[22px] font-bold tracking-[-0.05em]">
            <span className="grid size-[34px] place-items-center rounded-xl bg-accent text-accent-foreground">
              <Wrench className="size-[19px]" strokeWidth={2.4} />
            </span>
            <span>
              reparo<span className="text-[#8fb545]">.</span>
            </span>
          </div>

          <div className="max-w-md">
            <p className="text-[10px] font-bold tracking-[1.65px] text-white/60">
              TRUSTED REPAIR MARKETPLACE
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
              Your devices deserve better.{" "}
              <span className="font-serif font-normal italic text-[#c6f36a]">
                Get them fixed.
              </span>
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Book trusted professionals for your devices and home appliances.
              Pay only when the job is done.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-[#c6f36a] text-[#c6f36a]" />
                4.9/5 average rating
              </span>
              <span className="h-5 w-px bg-white/25" />
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#c6f36a]" />
                Vetted local pros
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* right form panel */}
      <div className="flex flex-col items-center justify-center px-5 py-12 sm:px-8">
        {/* small brand for mobile, where the photo panel is hidden */}
        <div className="mb-8 inline-flex items-center gap-2 text-lg font-bold tracking-[-0.04em] lg:hidden">
          <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Wrench className="size-4" strokeWidth={2.4} />
          </span>
          <span>
            reparo<span className="text-[#8fb545]">.</span>
          </span>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
