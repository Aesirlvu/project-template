"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

export default function ShowcaseLayoutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="accordion"
        title="Accordion"
        description="Vertical disclosure panels."
      >
        <ShowcaseDemo label="accordion" className="block w-full">
          <Accordion defaultValue={["item-1"]} className="w-full" multiple>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. It follows the WAI-ARIA disclosure pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                It animates the open and closed states.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can multiple items be open?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, when the component is not collapsible.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="collapsible"
        title="Collapsible"
        description="A single show and hide region."
      >
        <ShowcaseDemo label="collapsible" className="block w-full">
          <Collapsible className="flex flex-col gap-2">
            <CollapsibleTrigger
              render={<Button variant="outline">Toggle details</Button>}
            />
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                Everything hidden until the trigger is pressed.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="resizable"
        title="Resizable"
        description="Panels the user can drag to resize."
      >
        <ShowcaseDemo label="resizable" className="block w-full">
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-56 min-h-56 w-full rounded-none border border-border"
          >
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="flex h-full items-center justify-center p-6 text-sm">
                One
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="flex h-full items-center justify-center p-6 text-sm">
                Two
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="scroll-area"
        title="Scroll area"
        description="A custom scroll container with styled bars."
      >
        <ShowcaseDemo label="scroll area" className="block w-full">
          <ScrollArea className="h-40 w-full rounded-none border border-border">
            <div className="flex flex-col gap-2 p-4 text-sm">
              {Array.from({ length: 12 }, (_, index) => (
                <p key={index} className="text-muted-foreground">
                  Scrollable row {index + 1}
                </p>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="separator"
        title="Separator"
        description="A visual divider between content."
      >
        <ShowcaseDemo
          label="separator"
          className="flex-col items-stretch gap-4"
        >
          <div className="flex w-full flex-col gap-2">
            <span className="text-sm">Above the separator</span>
            <Separator />
            <span className="text-sm">Below the separator</span>
          </div>
          <div className="flex h-8 w-full items-center gap-3">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Right</span>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
