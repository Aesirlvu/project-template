import type { Metadata } from "next"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

import {
  DataGridDemo,
  RatingDemo,
  SegmentedControlDemo,
  TreeDemo,
} from "./_components/demos"

export const metadata: Metadata = {
  title: "shadcn + ui-sdk",
}

export default function UiSdkShowcasePage() {
  return (
    <>
      <ShowcaseSection
        id="segmented-control"
        title="Segmented control"
        description="ui-sdk owns the radio behaviour and the arrow keys, the shadcn toggle styles dress the items."
      >
        <ShowcaseDemo label="segmented-control">
          <SegmentedControlDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="rating"
        title="Rating"
        description="ui-sdk owns the radio semantics, the arrow keys and the half steps. shadcn has no rating at all."
      >
        <ShowcaseDemo label="rating">
          <RatingDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="tree"
        title="Tree"
        description="ui-sdk owns the roving focus and the branch expansion. The row is styled from the tree item label."
      >
        <ShowcaseDemo label="tree">
          <TreeDemo />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="data-grid"
        title="Data grid"
        description="A primitive of our own, built on the ui-sdk grid focus and cell range blocks with the spreadsheet selection."
      >
        <ShowcaseDemo label="data-grid" className="block w-full p-0">
          <DataGridDemo />
        </ShowcaseDemo>
      </ShowcaseSection>
    </>
  )
}
