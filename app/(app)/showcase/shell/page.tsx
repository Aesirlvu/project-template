"use client"

import { IconBold, IconItalic } from "@tabler/icons-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { DirectionProvider } from "@/components/ui/direction"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"
import { ShowcaseSidebar } from "../_components/showcase-sidebar"

export default function ShowcaseShellPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="sidebar"
        title="Sidebar"
        description="The application navigation rail with collapsible groups."
      >
        <ShowcaseDemo label="sidebar" className="block w-full p-0">
          <ShowcaseSidebar />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="menubar"
        title="Menubar"
        description="An application menu bar for desktop layouts."
      >
        <ShowcaseDemo label="menubar">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>
                    New tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New window</MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Bold <MenubarShortcut>⌘B</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Italic <MenubarShortcut>⌘I</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="message-scroller"
        title="Message scroller"
        description="A virtualised scroll surface for chat history."
      >
        <ShowcaseDemo label="message scroller" className="block w-full p-0">
          <MessageScrollerProvider>
            <MessageScroller className="h-64">
              <MessageScrollerViewport aria-label="Chat history">
                <MessageScrollerContent>
                  {Array.from({ length: 8 }, (_, index) => (
                    <MessageScrollerItem
                      key={index}
                      messageId={`message-${index}`}
                    >
                      <div className="rounded-none bg-muted px-4 py-3 text-sm">
                        Message number {index + 1}
                      </div>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton direction="end">
                <IconBold />
              </MessageScrollerButton>
              <MessageScrollerButton direction="start">
                <IconItalic />
              </MessageScrollerButton>
            </MessageScroller>
          </MessageScrollerProvider>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="direction"
        title="Direction"
        description="Right to left reading order for the whole subtree."
      >
        <ShowcaseDemo label="rtl" className="flex-col items-stretch gap-3">
          <DirectionProvider direction="rtl">
            <div className="flex items-center justify-between border border-border px-4 py-3 text-sm">
              <span>البداية</span>
              <span>النهاية</span>
            </div>
          </DirectionProvider>
          <p className="text-xs text-muted-foreground">
            Wrapping a subtree in the direction provider flips every logical
            property it contains.
          </p>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="primitives"
        title="Primitives"
        description="Small building blocks used across the set."
      >
        <ShowcaseDemo label="kbd">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <Kbd>Esc</Kbd>
        </ShowcaseDemo>

        <ShowcaseDemo label="aspect ratio">
          <AspectRatio
            ratio={16 / 9}
            className="flex w-full max-w-sm items-center justify-center bg-muted text-sm text-muted-foreground"
          >
            16 / 9
          </AspectRatio>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
