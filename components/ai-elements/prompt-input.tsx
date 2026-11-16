"use client"

import * as React from "react"
import type { BaseUIEvent } from "@base-ui/react/types"
import type { ChatStatus, FileUIPart, SourceDocumentUIPart } from "ai"
import { cn } from "cn"
import {
  IconArrowUp,
  IconDeviceDesktop,
  IconFileText,
  IconPhoto,
  IconPlus,
  IconSquareFilled,
  IconX,
} from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ============================================================================
// Helpers
// ============================================================================

const convertBlobUrlToDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

const captureScreenshot = async (): Promise<File | null> => {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getDisplayMedia
  ) {
    return null
  }

  let stream: MediaStream | null = null
  const video = document.createElement("video")
  video.muted = true
  video.playsInline = true

  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
    })

    video.srcObject = stream

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve()
      video.onerror = () => reject(new Error("Failed to load screen stream"))
    })

    await video.play()

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) {
      return null
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) {
      return null
    }

    context.drawImage(video, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png")
    })
    if (!blob) {
      return null
    }

    const timestamp = new Date()
      .toISOString()
      .replaceAll(/[:.]/g, "-")
      .replace("T", "_")
      .replace("Z", "")

    return new File([blob], `screenshot-${timestamp}.png`, {
      lastModified: Date.now(),
      type: "image/png",
    })
  } finally {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop()
      }
    }
    video.pause()
    video.srcObject = null
  }
}

const createId = () => crypto.randomUUID()

// ============================================================================
// Provider context and types
// ============================================================================

export interface AttachmentsContext {
  files: (FileUIPart & { id: string })[]
  add: (files: File[] | FileList) => void
  remove: (id: string) => void
  clear: () => void
  openFileDialog: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export interface TextInputContext {
  value: string
  setInput: (v: string) => void
  clear: () => void
}

export interface PromptInputControllerProps {
  textInput: TextInputContext
  attachments: AttachmentsContext
  /** Internal: lets `PromptInput` register its file input. */
  __registerFileInput: (
    ref: React.RefObject<HTMLInputElement | null>,
    open: () => void
  ) => void
}

const PromptInputController =
  React.createContext<PromptInputControllerProps | null>(null)
const ProviderAttachmentsContext =
  React.createContext<AttachmentsContext | null>(null)

/**
 * The controller of the surrounding provider.
 *
 * Throws when there is no `PromptInputProvider` above.
 */
export const usePromptInputController = () => {
  const ctx = React.useContext(PromptInputController)
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    )
  }
  return ctx
}

// Optional variant, for components that work with or without a provider.
const useOptionalPromptInputController = () =>
  React.useContext(PromptInputController)

/**
 * The attachments of the surrounding provider.
 *
 * Throws when there is no `PromptInputProvider` above.
 */
export const useProviderAttachments = () => {
  const ctx = React.useContext(ProviderAttachmentsContext)
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments()."
    )
  }
  return ctx
}

const useOptionalProviderAttachments = () =>
  React.useContext(ProviderAttachmentsContext)

export type PromptInputProviderProps = React.PropsWithChildren<{
  initialInput?: string
}>

/**
 * Lifts the prompt input state outside of `PromptInput`.
 *
 * Without it, `PromptInput` keeps its state to itself.
 */
export const PromptInputProvider = ({
  initialInput: initialTextInput = "",
  children,
}: PromptInputProviderProps) => {
  const [textInput, setTextInput] = React.useState(initialTextInput)
  const clearInput = React.useCallback(() => setTextInput(""), [])

  const [attachmentFiles, setAttachmentFiles] = React.useState<
    (FileUIPart & { id: string })[]
  >([])
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const openRef = React.useRef<() => void>(() => {})

  const add = React.useCallback((files: File[] | FileList) => {
    const incoming = [...files]
    if (incoming.length === 0) {
      return
    }

    setAttachmentFiles((prev) => [
      ...prev,
      ...incoming.map((file) => ({
        filename: file.name,
        id: createId(),
        mediaType: file.type,
        type: "file" as const,
        url: URL.createObjectURL(file),
      })),
    ])
  }, [])

  const remove = React.useCallback((id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id)
      if (found?.url) {
        URL.revokeObjectURL(found.url)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const clear = React.useCallback(() => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url)
        }
      }
      return []
    })
  }, [])

  // A ref keeps the cleanup effect free of stale closures.
  const attachmentsRef = React.useRef(attachmentFiles)

  React.useEffect(() => {
    attachmentsRef.current = attachmentFiles
  }, [attachmentFiles])

  React.useEffect(
    () => () => {
      for (const f of attachmentsRef.current) {
        if (f.url) {
          URL.revokeObjectURL(f.url)
        }
      }
    },
    []
  )

  const openFileDialog = React.useCallback(() => {
    openRef.current?.()
  }, [])

  const attachments = React.useMemo<AttachmentsContext>(
    () => ({
      add,
      clear,
      fileInputRef,
      files: attachmentFiles,
      openFileDialog,
      remove,
    }),
    [attachmentFiles, add, remove, clear, openFileDialog]
  )

  const __registerFileInput = React.useCallback(
    (ref: React.RefObject<HTMLInputElement | null>, open: () => void) => {
      fileInputRef.current = ref.current
      openRef.current = open
    },
    []
  )

  const controller = React.useMemo<PromptInputControllerProps>(
    () => ({
      __registerFileInput,
      attachments,
      textInput: {
        clear: clearInput,
        setInput: setTextInput,
        value: textInput,
      },
    }),
    [textInput, clearInput, attachments, __registerFileInput]
  )

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  )
}

// ============================================================================
// Component context and hooks
// ============================================================================

const LocalAttachmentsContext = React.createContext<AttachmentsContext | null>(
  null
)

/**
 * The attachments of the closest `PromptInput` or `PromptInputProvider`.
 *
 * Throws when there is neither.
 */
export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments()
  const local = React.useContext(LocalAttachmentsContext)
  const context = local ?? provider
  if (!context) {
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider"
    )
  }
  return context
}

// ============================================================================
// Referenced sources
// ============================================================================

export interface ReferencedSourcesContext {
  sources: (SourceDocumentUIPart & { id: string })[]
  add: (sources: SourceDocumentUIPart[] | SourceDocumentUIPart) => void
  remove: (id: string) => void
  clear: () => void
}

export const LocalReferencedSourcesContext =
  React.createContext<ReferencedSourcesContext | null>(null)

/**
 * The documents the prompt refers to.
 *
 * Throws when there is no `PromptInput` above.
 */
export const usePromptInputReferencedSources = () => {
  const ctx = React.useContext(LocalReferencedSourcesContext)
  if (!ctx) {
    throw new Error(
      "usePromptInputReferencedSources must be used within a LocalReferencedSourcesContext.Provider"
    )
  }
  return ctx
}

// ============================================================================
// Actions
// ============================================================================

export type PromptInputActionAddAttachmentsProps = React.ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string
}

/** Opens the file dialog of the prompt input. */
export const PromptInputActionAddAttachments = ({
  label = "Add photos or files",
  ...props
}: PromptInputActionAddAttachmentsProps) => {
  const attachments = usePromptInputAttachments()

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      attachments.openFileDialog()
    },
    [attachments]
  )

  return (
    <DropdownMenuItem {...props} onClick={handleClick}>
      <IconPhoto aria-hidden="true" />
      {label}
    </DropdownMenuItem>
  )
}

export type PromptInputActionAddScreenshotProps = React.ComponentProps<
  typeof DropdownMenuItem
> & {
  label?: string
}

/** Captures the screen and attaches the image. */
export const PromptInputActionAddScreenshot = ({
  label = "Take screenshot",
  onClick,
  ...props
}: PromptInputActionAddScreenshotProps) => {
  const attachments = usePromptInputAttachments()

  const handleClick = React.useCallback(
    async (event: BaseUIEvent<React.MouseEvent<HTMLDivElement>>) => {
      onClick?.(event)
      if (event.defaultPrevented) {
        return
      }

      try {
        const screenshot = await captureScreenshot()
        if (screenshot) {
          attachments.add([screenshot])
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "AbortError")
        ) {
          return
        }
        throw error
      }
    },
    [onClick, attachments]
  )

  return (
    <DropdownMenuItem {...props} onClick={handleClick}>
      <IconDeviceDesktop aria-hidden="true" />
      {label}
    </DropdownMenuItem>
  )
}

// ============================================================================
// Prompt input
// ============================================================================

export interface PromptInputMessage {
  text: string
  files: FileUIPart[]
}

export type PromptInputProps = Omit<
  React.HTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onError"
> & {
  /** For example "image/*". Leave it out to accept anything. */
  accept?: string
  /** Accept more than one file. */
  multiple?: boolean
  /** Accept drops anywhere on the document. Opt in. */
  globalDrop?: boolean
  /** Keep a hidden input in sync for native form posts. */
  syncHiddenInput?: boolean
  /** How many files are accepted at most. */
  maxFiles?: number
  /** The largest accepted file, in bytes. */
  maxFileSize?: number
  /** Called when a file is rejected. */
  onError?: (err: {
    code: "max_files" | "max_file_size" | "accept"
    message: string
  }) => void
  /** Called with the text and the files when the form is submitted. */
  onSubmit: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>
}

/**
 * The field the person types into.
 *
 * It owns the form, the attachment state and the hidden file input.
 */
export const PromptInput = ({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  const controller = useOptionalPromptInputController()
  const usingProvider = !!controller

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const formRef = React.useRef<HTMLFormElement | null>(null)

  const [items, setItems] = React.useState<(FileUIPart & { id: string })[]>([])
  const files = usingProvider ? controller.attachments.files : items

  const [referencedSources, setReferencedSources] = React.useState<
    (SourceDocumentUIPart & { id: string })[]
  >([])

  const filesRef = React.useRef(files)

  React.useEffect(() => {
    filesRef.current = files
  }, [files])

  const openFileDialogLocal = React.useCallback(() => {
    inputRef.current?.click()
  }, [])

  const matchesAccept = React.useCallback(
    (file: File) => {
      if (!accept || accept.trim() === "") {
        return true
      }

      const patterns = accept
        .split(",")
        .map((pattern) => pattern.trim())
        .filter(Boolean)

      return patterns.some((pattern) => {
        if (pattern.endsWith("/*")) {
          // image/* accepts image/png.
          const prefix = pattern.slice(0, -1)
          return file.type.startsWith(prefix)
        }
        return file.type === pattern
      })
    },
    [accept]
  )

  const addLocal = React.useCallback(
    (fileList: File[] | FileList) => {
      const incoming = [...fileList]
      const accepted = incoming.filter((file) => matchesAccept(file))
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        })
        return
      }
      const withinSize = (file: File) =>
        maxFileSize ? file.size <= maxFileSize : true
      const sized = accepted.filter(withinSize)
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        })
        return
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === "number"
            ? Math.max(0, maxFiles - prev.length)
            : undefined
        const capped =
          typeof capacity === "number" ? sized.slice(0, capacity) : sized
        if (typeof capacity === "number" && sized.length > capacity) {
          onError?.({
            code: "max_files",
            message: "Too many files. Some were not added.",
          })
        }
        const next: (FileUIPart & { id: string })[] = []
        for (const file of capped) {
          next.push({
            filename: file.name,
            id: createId(),
            mediaType: file.type,
            type: "file",
            url: URL.createObjectURL(file),
          })
        }
        return [...prev, ...next]
      })
    },
    [matchesAccept, maxFiles, maxFileSize, onError]
  )

  const removeLocal = React.useCallback(
    (id: string) =>
      setItems((prev) => {
        const found = prev.find((file) => file.id === id)
        if (found?.url) {
          URL.revokeObjectURL(found.url)
        }
        return prev.filter((file) => file.id !== id)
      }),
    []
  )

  // The provider gets the same validation before its own add.
  const addWithProviderValidation = React.useCallback(
    (fileList: File[] | FileList) => {
      const incoming = [...fileList]
      const accepted = incoming.filter((file) => matchesAccept(file))
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        })
        return
      }
      const withinSize = (file: File) =>
        maxFileSize ? file.size <= maxFileSize : true
      const sized = accepted.filter(withinSize)
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        })
        return
      }

      const currentCount = files.length
      const capacity =
        typeof maxFiles === "number"
          ? Math.max(0, maxFiles - currentCount)
          : undefined
      const capped =
        typeof capacity === "number" ? sized.slice(0, capacity) : sized
      if (typeof capacity === "number" && sized.length > capacity) {
        onError?.({
          code: "max_files",
          message: "Too many files. Some were not added.",
        })
      }

      if (capped.length > 0) {
        controller?.attachments.add(capped)
      }
    },
    [matchesAccept, maxFileSize, maxFiles, onError, files.length, controller]
  )

  const clearAttachments = React.useCallback(
    () =>
      usingProvider
        ? controller?.attachments.clear()
        : setItems((prev) => {
            for (const file of prev) {
              if (file.url) {
                URL.revokeObjectURL(file.url)
              }
            }
            return []
          }),
    [usingProvider, controller]
  )

  const clearReferencedSources = React.useCallback(
    () => setReferencedSources([]),
    []
  )

  const add = usingProvider ? addWithProviderValidation : addLocal
  const remove = usingProvider ? controller.attachments.remove : removeLocal
  const openFileDialog = usingProvider
    ? controller.attachments.openFileDialog
    : openFileDialogLocal

  const clear = React.useCallback(() => {
    clearAttachments()
    clearReferencedSources()
  }, [clearAttachments, clearReferencedSources])

  // Let the provider know about the hidden file input.
  React.useEffect(() => {
    if (!usingProvider) {
      return
    }
    controller.__registerFileInput(inputRef, () => inputRef.current?.click())
  }, [usingProvider, controller])

  // A file input cannot be set programmatically, so it is reset instead.
  React.useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) {
      inputRef.current.value = ""
    }
  }, [files, syncHiddenInput])

  React.useEffect(() => {
    const form = formRef.current
    if (!form || globalDrop) {
      return
    }

    const onDragOver = (event: DragEvent) => {
      if (event.dataTransfer?.types?.includes("Files")) {
        event.preventDefault()
      }
    }
    const onDrop = (event: DragEvent) => {
      if (event.dataTransfer?.types?.includes("Files")) {
        event.preventDefault()
      }
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        add(event.dataTransfer.files)
      }
    }
    form.addEventListener("dragover", onDragOver)
    form.addEventListener("drop", onDrop)
    return () => {
      form.removeEventListener("dragover", onDragOver)
      form.removeEventListener("drop", onDrop)
    }
  }, [add, globalDrop])

  React.useEffect(() => {
    if (!globalDrop) {
      return
    }

    const onDragOver = (event: DragEvent) => {
      if (event.dataTransfer?.types?.includes("Files")) {
        event.preventDefault()
      }
    }
    const onDrop = (event: DragEvent) => {
      if (event.dataTransfer?.types?.includes("Files")) {
        event.preventDefault()
      }
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        add(event.dataTransfer.files)
      }
    }
    document.addEventListener("dragover", onDragOver)
    document.addEventListener("drop", onDrop)
    return () => {
      document.removeEventListener("dragover", onDragOver)
      document.removeEventListener("drop", onDrop)
    }
  }, [add, globalDrop])

  React.useEffect(
    () => () => {
      if (!usingProvider) {
        for (const file of filesRef.current) {
          if (file.url) {
            URL.revokeObjectURL(file.url)
          }
        }
      }
    },
    [usingProvider]
  )

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files) {
        add(event.currentTarget.files)
      }
      // Reset the value so the same file can be picked again.
      event.currentTarget.value = ""
    },
    [add]
  )

  const attachmentsCtx = React.useMemo<AttachmentsContext>(
    () => ({
      add,
      clear: clearAttachments,
      fileInputRef: inputRef,
      files: files.map((item) => ({ ...item, id: item.id })),
      openFileDialog,
      remove,
    }),
    [files, add, remove, clearAttachments, openFileDialog]
  )

  const refsCtx = React.useMemo<ReferencedSourcesContext>(
    () => ({
      add: (incoming: SourceDocumentUIPart[] | SourceDocumentUIPart) => {
        const array = Array.isArray(incoming) ? incoming : [incoming]
        setReferencedSources((prev) => [
          ...prev,
          ...array.map((source) => ({ ...source, id: createId() })),
        ])
      },
      clear: clearReferencedSources,
      remove: (id: string) => {
        setReferencedSources((prev) =>
          prev.filter((source) => source.id !== id)
        )
      },
      sources: referencedSources,
    }),
    [referencedSources, clearReferencedSources]
  )

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const form = event.currentTarget
      const formData = new FormData(form)

      const text = usingProvider
        ? controller.textInput.value
        : ((formData.get("message") as string) ?? "")

      // Reset the form right after reading the text, so nothing is lost while
      // the blob URLs convert.
      if (!usingProvider) {
        form.reset()
      }

      try {
        const convertedFiles: FileUIPart[] = await Promise.all(
          files.map(async (file) => {
            const { id: _ignoredId, ...item } = file
            void _ignoredId
            if (item.url?.startsWith("blob:")) {
              const dataUrl = await convertBlobUrlToDataUrl(item.url)
              return {
                ...item,
                url: dataUrl ?? item.url,
              }
            }
            return item
          })
        )

        const result = onSubmit({ files: convertedFiles, text }, event)

        if (result instanceof Promise) {
          try {
            await result
            clear()
            if (usingProvider) {
              controller.textInput.clear()
            }
          } catch {
            // Keep the input so the person can retry.
          }
        } else {
          clear()
          if (usingProvider) {
            controller.textInput.clear()
          }
        }
      } catch {
        // Keep the input so the person can retry.
      }
    },
    [usingProvider, controller, files, onSubmit, clear]
  )

  const inner = (
    <>
      <input
        accept={accept}
        aria-label="Upload files"
        className="hidden"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        title="Upload files"
        type="file"
      />
      <form
        className={cn("w-full", className)}
        onSubmit={handleSubmit}
        ref={formRef}
        {...props}
      >
        <InputGroup className="overflow-hidden">{children}</InputGroup>
      </form>
    </>
  )

  return (
    <LocalAttachmentsContext.Provider value={attachmentsCtx}>
      <LocalReferencedSourcesContext.Provider value={refsCtx}>
        {inner}
      </LocalReferencedSourcesContext.Provider>
    </LocalAttachmentsContext.Provider>
  )
}

export type PromptInputBodyProps = React.HTMLAttributes<HTMLDivElement>

/** A wrapper that does not break the input group layout. */
export const PromptInputBody = ({
  className,
  ...props
}: PromptInputBodyProps) => (
  <div className={cn("contents", className)} {...props} />
)

export type PromptInputTextareaProps = React.ComponentProps<
  typeof InputGroupTextarea
>

/** The field the person types into. */
export const PromptInputTextarea = ({
  onChange,
  onKeyDown,
  className,
  placeholder = "What would you like to know?",
  ...props
}: PromptInputTextareaProps) => {
  const controller = useOptionalPromptInputController()
  const attachments = usePromptInputAttachments()
  const [isComposing, setIsComposing] = React.useState(false)

  const handleKeyDown = React.useCallback<
    React.KeyboardEventHandler<HTMLTextAreaElement>
  >(
    (event) => {
      // The consumer comes first, and it can stop the rest.
      onKeyDown?.(event)

      if (event.defaultPrevented) {
        return
      }

      if (event.key === "Enter") {
        if (isComposing || event.nativeEvent.isComposing) {
          return
        }
        if (event.shiftKey) {
          return
        }
        event.preventDefault()

        const { form } = event.currentTarget
        const submitButton = form?.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement | null
        if (submitButton?.disabled) {
          return
        }

        form?.requestSubmit()
      }

      // Backspace on an empty field removes the last attachment.
      if (
        event.key === "Backspace" &&
        event.currentTarget.value === "" &&
        attachments.files.length > 0
      ) {
        event.preventDefault()
        const lastAttachment = attachments.files.at(-1)
        if (lastAttachment) {
          attachments.remove(lastAttachment.id)
        }
      }
    },
    [onKeyDown, isComposing, attachments]
  )

  const handlePaste = React.useCallback<
    React.ClipboardEventHandler<HTMLTextAreaElement>
  >(
    (event) => {
      const items = event.clipboardData?.items
      if (!items) {
        return
      }

      const files: File[] = []
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }

      if (files.length > 0) {
        event.preventDefault()
        attachments.add(files)
      }
    },
    [attachments]
  )

  const handleCompositionEnd = React.useCallback(
    () => setIsComposing(false),
    []
  )
  const handleCompositionStart = React.useCallback(
    () => setIsComposing(true),
    []
  )

  const controlledProps = controller
    ? {
        onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
          controller.textInput.setInput(event.currentTarget.value)
          onChange?.(event)
        },
        value: controller.textInput.value,
      }
    : {
        onChange,
      }

  return (
    <InputGroupTextarea
      className={cn("p-3", className)}
      name="message"
      onCompositionEnd={handleCompositionEnd}
      onCompositionStart={handleCompositionStart}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      {...props}
      {...controlledProps}
    />
  )
}

export type PromptInputHeaderProps = Omit<
  React.ComponentProps<typeof InputGroupAddon>,
  "align"
>

/** The attachments of the prompt input. */
export const PromptInputHeader = ({
  className,
  ...props
}: PromptInputHeaderProps) => {
  const { files, remove } = usePromptInputAttachments()

  if (files.length === 0) {
    return null
  }

  return (
    <InputGroupAddon
      align="block-start"
      className={cn("order-first flex-wrap gap-1", className)}
      {...props}
    >
      {files.map((file) => (
        <Attachment key={file.id} size="sm">
          <AttachmentMedia>
            <IconFileText aria-hidden="true" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.filename ?? file.mediaType}</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              aria-label={`Remove ${file.filename ?? file.mediaType}`}
              onClick={() => remove(file.id)}
            >
              <IconX aria-hidden="true" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </InputGroupAddon>
  )
}

export type PromptInputFooterProps = Omit<
  React.ComponentProps<typeof InputGroupAddon>,
  "align"
>

/** The row under the field that holds the actions. */
export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon
    align="block-end"
    className={cn("justify-between gap-1", className)}
    {...props}
  />
)

export type PromptInputToolsProps = React.HTMLAttributes<HTMLDivElement>

/** A row of small tools inside the footer. */
export const PromptInputTools = ({
  className,
  ...props
}: PromptInputToolsProps) => (
  <div
    className={cn("flex min-w-0 items-center gap-1", className)}
    {...props}
  />
)

export type PromptInputButtonTooltip =
  | string
  | {
      content: React.ReactNode
      shortcut?: string
      side?: React.ComponentProps<typeof TooltipContent>["side"]
    }

export type PromptInputButtonProps = React.ComponentProps<
  typeof InputGroupButton
> & {
  tooltip?: PromptInputButtonTooltip
}

/** A button of the prompt input, optionally with a tooltip. */
export const PromptInputButton = ({
  variant = "ghost",
  className,
  size,
  tooltip,
  children,
  ...props
}: PromptInputButtonProps) => {
  const newSize =
    size ?? (React.Children.count(children) > 1 ? "sm" : "icon-sm")

  const button = (
    <InputGroupButton
      className={cn(className)}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </InputGroupButton>
  )

  if (!tooltip) {
    return button
  }

  const tooltipContent = typeof tooltip === "string" ? tooltip : tooltip.content
  const shortcut = typeof tooltip === "string" ? undefined : tooltip.shortcut
  const side = typeof tooltip === "string" ? "top" : (tooltip.side ?? "top")

  return (
    <Tooltip>
      <TooltipTrigger render={button}>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        {tooltipContent}
        {shortcut && (
          <span className="ml-2 text-muted-foreground">{shortcut}</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

export type PromptInputActionMenuProps = React.ComponentProps<
  typeof DropdownMenu
>

/** The menu with the actions of the prompt input. */
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
)

export type PromptInputActionMenuTriggerProps = Omit<
  PromptInputButtonProps,
  "tooltip"
>

/** Opens the action menu. */
export const PromptInputActionMenuTrigger = ({
  className,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger
    render={
      <InputGroupButton
        className={cn("rounded-full", className)}
        size="icon-sm"
        type="button"
        variant="outline"
        {...props}
      />
    }
  >
    {children ?? <IconPlus aria-hidden="true" />}
  </DropdownMenuTrigger>
)

export type PromptInputActionMenuContentProps = React.ComponentProps<
  typeof DropdownMenuContent
>

/** The content of the action menu. */
export const PromptInputActionMenuContent = ({
  className,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent align="start" className={cn(className)} {...props} />
)

export type PromptInputActionMenuItemProps = React.ComponentProps<
  typeof DropdownMenuItem
>

/** An item of the action menu. */
export const PromptInputActionMenuItem = ({
  className,
  ...props
}: PromptInputActionMenuItemProps) => (
  <DropdownMenuItem className={cn(className)} {...props} />
)

export type PromptInputSubmitProps = React.ComponentProps<
  typeof InputGroupButton
> & {
  /** The status of the chat, which decides the icon. */
  status?: ChatStatus
  /** Called instead of submitting while the model is working. */
  onStop?: () => void
}

/** Sends the message, or stops the model while it is working. */
export const PromptInputSubmit = ({
  className,
  variant = "default",
  size = "icon-sm",
  status,
  onStop,
  onClick,
  children,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === "submitted" || status === "streaming"

  let icon: React.ReactNode = <IconArrowUp aria-hidden="true" />

  if (status === "submitted") {
    icon = <Spinner />
  } else if (status === "streaming") {
    icon = <IconSquareFilled aria-hidden="true" />
  } else if (status === "error") {
    icon = <IconX aria-hidden="true" />
  }

  const handleClick = React.useCallback(
    (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>) => {
      if (isGenerating && onStop) {
        event.preventDefault()
        onStop()
        return
      }
      onClick?.(event)
    },
    [isGenerating, onStop, onClick]
  )

  return (
    <InputGroupButton
      aria-label={isGenerating ? "Stop" : "Submit"}
      className={cn("rounded-full", className)}
      onClick={handleClick}
      size={size}
      type={isGenerating && onStop ? "button" : "submit"}
      variant={variant}
      {...props}
    >
      {children ?? icon}
    </InputGroupButton>
  )
}

export type PromptInputSelectProps = React.ComponentProps<typeof Select>

/** The model or effort selector of the prompt input. */
export const PromptInputSelect = (props: PromptInputSelectProps) => (
  <Select {...props} />
)

export type PromptInputSelectTriggerProps = React.ComponentProps<
  typeof SelectTrigger
>

export const PromptInputSelectTrigger = ({
  className,
  ...props
}: PromptInputSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
      className
    )}
    {...props}
  />
)

export type PromptInputSelectContentProps = React.ComponentProps<
  typeof SelectContent
>

export const PromptInputSelectContent = ({
  className,
  ...props
}: PromptInputSelectContentProps) => (
  <SelectContent className={cn(className)} {...props} />
)

export type PromptInputSelectItemProps = React.ComponentProps<typeof SelectItem>

export const PromptInputSelectItem = ({
  className,
  ...props
}: PromptInputSelectItemProps) => (
  <SelectItem className={cn(className)} {...props} />
)

export type PromptInputSelectValueProps = React.ComponentProps<
  typeof SelectValue
>

export const PromptInputSelectValue = ({
  className,
  ...props
}: PromptInputSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
)

type PromptInputHoverCardContextValue = {
  openDelay: number
  closeDelay: number
}

const PromptInputHoverCardContext =
  React.createContext<PromptInputHoverCardContextValue>({
    closeDelay: 0,
    openDelay: 0,
  })

export type PromptInputHoverCardProps = React.ComponentProps<
  typeof HoverCard
> & {
  /** How long to wait before the card opens, in milliseconds. */
  openDelay?: number
  /** How long to wait before the card closes, in milliseconds. */
  closeDelay?: number
}

/** The card that explains the selected model or effort. */
export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  children,
  ...props
}: PromptInputHoverCardProps) => {
  const value = React.useMemo(
    () => ({ closeDelay, openDelay }),
    [closeDelay, openDelay]
  )

  return (
    <PromptInputHoverCardContext.Provider value={value}>
      <HoverCard {...props}>{children}</HoverCard>
    </PromptInputHoverCardContext.Provider>
  )
}

export type PromptInputHoverCardTriggerProps = React.ComponentProps<
  typeof HoverCardTrigger
>

export const PromptInputHoverCardTrigger = (
  props: PromptInputHoverCardTriggerProps
) => {
  const { openDelay, closeDelay } = React.useContext(
    PromptInputHoverCardContext
  )

  return (
    <HoverCardTrigger closeDelay={closeDelay} delay={openDelay} {...props} />
  )
}

export type PromptInputHoverCardContentProps = React.ComponentProps<
  typeof HoverCardContent
>

export const PromptInputHoverCardContent = ({
  align = "start",
  ...props
}: PromptInputHoverCardContentProps) => (
  <HoverCardContent align={align} {...props} />
)

export type PromptInputTabsListProps = React.HTMLAttributes<HTMLDivElement>

export const PromptInputTabsList = ({
  className,
  ...props
}: PromptInputTabsListProps) => <div className={cn(className)} {...props} />

export type PromptInputTabProps = React.HTMLAttributes<HTMLDivElement>

export const PromptInputTab = ({
  className,
  ...props
}: PromptInputTabProps) => <div className={cn(className)} {...props} />

export type PromptInputTabLabelProps = React.HTMLAttributes<HTMLHeadingElement>

export const PromptInputTabLabel = ({
  className,
  ...props
}: PromptInputTabLabelProps) => (
  <h3
    className={cn(
      "mb-2 px-3 text-xs font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
)

export type PromptInputTabBodyProps = React.HTMLAttributes<HTMLDivElement>

export const PromptInputTabBody = ({
  className,
  ...props
}: PromptInputTabBodyProps) => (
  <div className={cn("space-y-1", className)} {...props} />
)

export type PromptInputTabItemProps = React.HTMLAttributes<HTMLDivElement>

export const PromptInputTabItem = ({
  className,
  ...props
}: PromptInputTabItemProps) => (
  <div
    className={cn(
      "flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent",
      className
    )}
    {...props}
  />
)

export type PromptInputCommandProps = React.ComponentProps<typeof Command>

export const PromptInputCommand = ({
  className,
  ...props
}: PromptInputCommandProps) => <Command className={cn(className)} {...props} />

export type PromptInputCommandInputProps = React.ComponentProps<
  typeof CommandInput
>

export const PromptInputCommandInput = ({
  className,
  ...props
}: PromptInputCommandInputProps) => (
  <CommandInput className={cn(className)} {...props} />
)

export type PromptInputCommandListProps = React.ComponentProps<
  typeof CommandList
>

export const PromptInputCommandList = ({
  className,
  ...props
}: PromptInputCommandListProps) => (
  <CommandList className={cn(className)} {...props} />
)

export type PromptInputCommandEmptyProps = React.ComponentProps<
  typeof CommandEmpty
>

export const PromptInputCommandEmpty = ({
  className,
  ...props
}: PromptInputCommandEmptyProps) => (
  <CommandEmpty className={cn(className)} {...props} />
)

export type PromptInputCommandGroupProps = React.ComponentProps<
  typeof CommandGroup
>

export const PromptInputCommandGroup = ({
  className,
  ...props
}: PromptInputCommandGroupProps) => (
  <CommandGroup className={cn(className)} {...props} />
)

export type PromptInputCommandItemProps = React.ComponentProps<
  typeof CommandItem
>

export const PromptInputCommandItem = ({
  className,
  ...props
}: PromptInputCommandItemProps) => (
  <CommandItem className={cn(className)} {...props} />
)

export type PromptInputCommandSeparatorProps = React.ComponentProps<
  typeof CommandSeparator
>

export const PromptInputCommandSeparator = ({
  className,
  ...props
}: PromptInputCommandSeparatorProps) => (
  <CommandSeparator className={cn(className)} {...props} />
)
