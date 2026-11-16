"use client"

import * as React from "react"
import { cn } from "cn"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export type InlineCitationProps = React.ComponentProps<"span">

export function InlineCitation({ className, ...props }: InlineCitationProps) {
  return (
    <span
      className={cn("group inline items-center gap-1", className)}
      {...props}
    />
  )
}

export type InlineCitationTextProps = React.ComponentProps<"span">

export function InlineCitationText({
  className,
  ...props
}: InlineCitationTextProps) {
  return (
    <span
      className={cn("transition-colors group-hover:bg-accent", className)}
      {...props}
    />
  )
}

export type InlineCitationCardProps = React.ComponentProps<typeof HoverCard>

export function InlineCitationCard(props: InlineCitationCardProps) {
  return <HoverCard {...props} />
}

export type InlineCitationCardTriggerProps = React.ComponentProps<
  typeof Button
> & {
  sources: string[]
}

export function InlineCitationCardTrigger({
  sources,
  className,
  children,
  ...props
}: InlineCitationCardTriggerProps) {
  const first = sources[0]

  return (
    <HoverCardTrigger
      delay={10}
      closeDelay={100}
      render={
        <Button
          variant="secondary"
          size="xs"
          className={cn("ml-1 rounded-full", className)}
          {...props}
        />
      }
    >
      {children ?? (
        <>
          {first ? hostname(first) : "unknown"}
          {sources.length > 1 ? ` +${sources.length - 1}` : null}
        </>
      )}
    </HoverCardTrigger>
  )
}

export type InlineCitationCardBodyProps = React.ComponentProps<"div">

export function InlineCitationCardBody({
  className,
  ...props
}: InlineCitationCardBodyProps) {
  return (
    <HoverCardContent
      className={cn("relative w-80 p-0", className)}
      {...props}
    />
  )
}

const CarouselApiContext = React.createContext<CarouselApi | undefined>(
  undefined
)

function useCarouselApi() {
  return React.useContext(CarouselApiContext)
}

export type InlineCitationCarouselProps = React.ComponentProps<typeof Carousel>

export function InlineCitationCarousel({
  className,
  children,
  ...props
}: InlineCitationCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()

  return (
    <CarouselApiContext.Provider value={api}>
      <Carousel className={cn("w-full", className)} setApi={setApi} {...props}>
        {children}
      </Carousel>
    </CarouselApiContext.Provider>
  )
}

export type InlineCitationCarouselContentProps = React.ComponentProps<"div">

export function InlineCitationCarouselContent(
  props: InlineCitationCarouselContentProps
) {
  return <CarouselContent {...props} />
}

export type InlineCitationCarouselItemProps = React.ComponentProps<"div">

export function InlineCitationCarouselItem({
  className,
  ...props
}: InlineCitationCarouselItemProps) {
  return (
    <CarouselItem
      className={cn("w-full space-y-2 p-4 pl-8", className)}
      {...props}
    />
  )
}

export type InlineCitationCarouselHeaderProps = React.ComponentProps<"div">

export function InlineCitationCarouselHeader({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2",
        className
      )}
      {...props}
    />
  )
}

export type InlineCitationCarouselIndexProps = React.ComponentProps<"div">

export function InlineCitationCarouselIndex({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) {
  const api = useCarouselApi()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const syncState = React.useCallback(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
  }, [api])

  React.useEffect(() => {
    if (!api) {
      return
    }

    // Embla only reports a scroll position once it is activated, so the
    // initial read is deferred to the next frame.
    const frame = requestAnimationFrame(() => syncState())

    api.on("select", syncState)

    return () => {
      cancelAnimationFrame(frame)
      api.off("select", syncState)
    }
  }, [api, syncState])

  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-end px-3 py-1 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? `${current}/${count}`}
    </div>
  )
}

export type InlineCitationCarouselPrevProps = React.ComponentProps<"button">

export function InlineCitationCarouselPrev({
  className,
  ...props
}: InlineCitationCarouselPrevProps) {
  const api = useCarouselApi()

  const handleClick = React.useCallback(() => {
    if (api) {
      api.scrollPrev()
    }
  }, [api])

  return (
    <button
      aria-label="Previous"
      className={cn("shrink-0", className)}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <IconArrowLeft
        aria-hidden="true"
        className="size-4 text-muted-foreground"
      />
    </button>
  )
}

export type InlineCitationCarouselNextProps = React.ComponentProps<"button">

export function InlineCitationCarouselNext({
  className,
  ...props
}: InlineCitationCarouselNextProps) {
  const api = useCarouselApi()

  const handleClick = React.useCallback(() => {
    if (api) {
      api.scrollNext()
    }
  }, [api])

  return (
    <button
      aria-label="Next"
      className={cn("shrink-0", className)}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <IconArrowRight
        aria-hidden="true"
        className="size-4 text-muted-foreground"
      />
    </button>
  )
}

export type InlineCitationSourceProps = React.ComponentProps<"div"> & {
  title?: string
  url?: string
  description?: string
}

export function InlineCitationSource({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {title ? (
        <h4 className="truncate text-sm leading-tight font-medium">{title}</h4>
      ) : null}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="truncate text-xs break-all text-muted-foreground underline-offset-4 hover:underline"
        >
          {url}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
      {description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  )
}

export type InlineCitationQuoteProps = React.ComponentProps<"blockquote">

export function InlineCitationQuote({
  children,
  className,
  ...props
}: InlineCitationQuoteProps) {
  return (
    <blockquote
      className={cn(
        "border-l-2 border-muted pl-3 text-sm text-muted-foreground italic",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}
