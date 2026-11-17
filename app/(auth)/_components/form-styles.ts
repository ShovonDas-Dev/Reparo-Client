// Shared styling for the auth forms, so /sign-in and /sign-up look the same.
// Strings are reused instead of components to keep the forms easy to follow.

export const labelClass = "mb-1.5 block text-[13px] font-medium text-foreground"

export const inputClass =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"

export const fieldErrorClass = "mt-1 text-xs text-destructive"
