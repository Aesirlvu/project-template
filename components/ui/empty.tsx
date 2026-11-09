import { compose, composeClasses } from "@/lib/compose-raw"

const emptyClasses = compose.div(() => [
  "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 border-dashed p-12 text-center text-balance",
])

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={composeClasses(emptyClasses.toClass(), className)}
      {...props}
    />
  )
}

const emptyHeaderClasses = compose.div(() => [
  "flex max-w-sm flex-col items-center gap-2",
])

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={composeClasses(emptyHeaderClasses.toClass(), className)}
      {...props}
    />
  )
}

type EmptyMediaVariant = "default" | "icon"

const EmptyMediaBase = compose.div<{ $variant: EmptyMediaVariant }>(
  (conditional) => [
    "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
    conditional(["bg-transparent"], ({ $variant }) => $variant === "default"),
    conditional(
      [
        "flex size-10 shrink-0 items-center justify-center rounded-none bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
      ],
      ({ $variant }) => $variant === "icon"
    ),
  ]
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: EmptyMediaVariant }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={composeClasses(
        EmptyMediaBase.toClass({ $variant: variant }),
        className
      )}
      {...props}
    />
  )
}

const emptyTitleClasses = compose.div(() => [
  "cn-font-heading text-lg font-semibold tracking-wider uppercase",
])

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={composeClasses(emptyTitleClasses.toClass(), className)}
      {...props}
    />
  )
}

const emptyDescriptionClasses = compose.div(() => [
  "mt-0.5 text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
])

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={composeClasses(emptyDescriptionClasses.toClass(), className)}
      {...props}
    />
  )
}

const emptyContentClasses = compose.div(() => [
  "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
])

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={composeClasses(emptyContentClasses.toClass(), className)}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
