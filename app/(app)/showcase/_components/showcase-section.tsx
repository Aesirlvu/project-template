import type { ReactNode } from "react"

export function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 border-b py-10 last:border-b-0">
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="mt-6 flex flex-col gap-10">{children}</div>
    </section>
  )
}

export function ShowcaseDemo({
  label,
  className,
  children,
}: {
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      ) : null}
      <div
        data-slot="showcase-demo"
        className={
          className ??
          "flex flex-wrap items-center gap-3 rounded-none border border-border bg-card p-6 text-card-foreground"
        }
      >
        {children}
      </div>
    </div>
  )
}
