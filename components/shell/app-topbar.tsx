import { cn } from "@/lib/utils"

export function AppTopbar({
  title,
  actions,
  className,
}: {
  title?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4",
        className
      )}
    >
      {title ? (
        <h1 className="truncate text-sm font-semibold">{title}</h1>
      ) : (
        <span />
      )}
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
