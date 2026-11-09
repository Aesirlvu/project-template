import * as React from "react"

import { compose, composeClasses } from "@/lib/compose-raw"

type AlertVariant = "default" | "destructive"

const AlertBase = compose.div<{ $variant: AlertVariant }>((conditional) => [
  "group/alert relative grid w-full gap-1 border bg-background px-4 py-3 text-left text-sm after:absolute after:-inset-y-px after:-left-px after:w-0.5 has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  conditional(
    ["bg-card text-card-foreground after:bg-foreground"],
    ({ $variant }) => $variant === "default"
  ),
  conditional(
    [
      "bg-card text-destructive after:bg-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
    ],
    ({ $variant }) => $variant === "destructive"
  ),
])

const alertTitleClasses = compose.div(() => [
  "text-sm font-semibold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
])

const alertDescriptionClasses = compose.div(() => [
  "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
])

const alertActionClasses = compose.div(() => ["absolute top-2.5 right-3"])

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={composeClasses(
        AlertBase.toClass({ $variant: variant }),
        className
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={composeClasses(alertTitleClasses.toClass(), className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={composeClasses(alertDescriptionClasses.toClass(), className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={composeClasses(alertActionClasses.toClass(), className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
