"use client"

import * as React from "react"
import { cn } from "cn"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"

function MarkdownCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{language || "text"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function MarkdownCode({
  className,
  children,
  ...props
}: React.ComponentProps<"code">) {
  // A fenced block arrives with the language on the class name. Inline code
  // has no language, so it stays inline.
  const language = /language-(\S+)/.exec(className ?? "")?.[1]

  if (!language) {
    return (
      <code
        className={cn(
          "rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]",
          className
        )}
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <MarkdownCodeBlock
      code={typeof children === "string" ? children.replace(/\n$/, "") : ""}
      language={language}
    />
  )
}

const DEFAULT_COMPONENTS: Components = {
  code: MarkdownCode,
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("leading-7 not-first:mt-5", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("mt-5 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-5 w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-semibold [&[align=center]]:text-center",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-5 border-border", className)} {...props} />
  ),
}

/**
 * Renders markdown with GitHub flavoured markdown support.
 *
 * Fenced code blocks are highlighted with the project highlighter and reuse
 * the shadcn `CodeBlock` component, so markdown output matches the code
 * blocks rendered elsewhere in the app.
 */
type MarkdownProps = Omit<
  React.ComponentProps<typeof ReactMarkdown>,
  "className" | "components"
> & {
  className?: string
  components?: Components
}

function Markdown({ className, components, ...props }: MarkdownProps) {
  return (
    <div
      data-slot="markdown"
      className={cn("w-full min-w-0 leading-7", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ ...DEFAULT_COMPONENTS, ...components }}
        {...props}
      />
    </div>
  )
}

export { Markdown }
