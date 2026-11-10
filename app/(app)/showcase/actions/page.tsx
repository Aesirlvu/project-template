import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

export default function ShowcaseActionsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="button"
        title="Button"
        description="Six variants and eight sizes, all sharing one contract."
      >
        <ShowcaseDemo label="variants">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </ShowcaseDemo>

        <ShowcaseDemo label="sizes">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </ShowcaseDemo>

        <ShowcaseDemo label="icon sizes">
          <Button size="icon-xs" aria-label="Bold">
            <IconBold />
          </Button>
          <Button size="icon-sm" aria-label="Italic">
            <IconItalic />
          </Button>
          <Button size="icon" aria-label="Underline">
            <IconUnderline />
          </Button>
          <Button size="icon-lg" aria-label="Underline">
            <IconUnderline />
          </Button>
        </ShowcaseDemo>

        <ShowcaseDemo label="states">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled outline
          </Button>
          <Button className="w-full max-w-40">Full width</Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="button-group"
        title="Button group"
        description="Attached actions that share a single border."
      >
        <ShowcaseDemo label="horizontal">
          <ButtonGroup>
            <Button variant="outline">Undo</Button>
            <Button variant="outline">Redo</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Save</Button>
          </ButtonGroup>
        </ShowcaseDemo>

        <ShowcaseDemo label="with text">
          <ButtonGroup>
            <ButtonGroupText>Zoom</ButtonGroupText>
            <Button variant="outline">-</Button>
            <Button variant="outline">+</Button>
          </ButtonGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="toggle"
        title="Toggle"
        description="A two-state button with a pressed state."
      >
        <ShowcaseDemo label="variants">
          <Toggle>Bold</Toggle>
          <Toggle variant="outline">Italic</Toggle>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="toggle-group"
        title="Toggle group"
        description="One or many toggles sharing the same variant and size."
      >
        <ShowcaseDemo label="single selection">
          <ToggleGroup>
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </ShowcaseDemo>

        <ShowcaseDemo label="multiple selection">
          <ToggleGroup multiple>
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          </ToggleGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="badge"
        title="Badge"
        description="Compact status labels."
      >
        <ShowcaseDemo label="variants">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="link">Link</Badge>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="marker"
        title="Marker"
        description="Section separators and inline labels."
      >
        <ShowcaseDemo label="variants" className="flex-col items-start gap-4">
          <Marker>
            <MarkerIcon />
            <MarkerContent>Default marker</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerContent>Separator</MarkerContent>
          </Marker>
          <Marker variant="border">
            <MarkerContent>Border</MarkerContent>
          </Marker>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
