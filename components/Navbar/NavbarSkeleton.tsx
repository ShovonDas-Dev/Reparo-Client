
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[66px] w-full max-w-7xl items-center justify-between px-5 md:h-[78px] md:px-8 lg:px-12">

        {/* Logo Skeleton */}
        <div className="flex items-center gap-2.5">
          <div className="size-[34px] animate-pulse rounded-xl bg-muted" />

          <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Desktop Navigation Skeleton */}
        <nav className="ml-[120px] hidden items-center gap-[38px] md:flex">
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </nav>

        {/* Desktop Actions Skeleton */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="size-9 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Mobile Actions Skeleton */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="size-9 animate-pulse rounded-full bg-muted" />
          <div className="size-10 animate-pulse rounded-lg bg-muted" />
        </div>

      </div>
    </header>
  )
}
