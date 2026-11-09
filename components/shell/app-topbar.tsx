import { compose } from "@/lib/utils"

const TopbarRoot = compose.header<{ className?: string }>(() => [
  "flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4",
])

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
    <TopbarRoot className={className}>
      {title ? (
        <h1 className="truncate text-sm font-semibold">{title}</h1>
      ) : (
        <span />
      )}
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </TopbarRoot>
  )
}
