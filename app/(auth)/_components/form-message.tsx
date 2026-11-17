// Small banner used to show form feedback (error / success / info).
export function FormMessage({
  type,
  children,
}: {
  type: "error" | "success" | "info"
  children: React.ReactNode
}) {
  const styles = {
    error: "border-destructive/30 bg-destructive/10 text-destructive",
    success: "border-ring/40 bg-accent/20 text-foreground",
    info: "border-border bg-muted text-muted-foreground",
  }[type]

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2.5 text-xs leading-relaxed ${styles}`}
    >
      {children}
    </div>
  )
}
