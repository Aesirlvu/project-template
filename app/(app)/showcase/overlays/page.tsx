"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

export default function ShowcaseOverlaysPage() {
  return (
    <TooltipProvider>
      <div className="mx-auto flex max-w-3xl flex-col">
        <ShowcaseSection
          id="dialog"
          title="Dialog"
          description="A modal window for a focused task."
        >
          <ShowcaseDemo label="dialog">
            <Dialog>
              <DialogTrigger
                render={<Button variant="outline">Open dialog</Button>}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you are
                    done.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="alert-dialog"
          title="Alert dialog"
          description="A modal that interrupts to confirm a destructive action."
        >
          <ShowcaseDemo label="alert dialog">
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive">Delete project</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes the project and all of its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <AlertDialogAction
                    render={<Button variant="destructive">Delete</Button>}
                  />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="sheet"
          title="Sheet"
          description="A panel that slides in from an edge."
        >
          <ShowcaseDemo label="sheet">
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline">Open sheet</Button>}
              >
                Open sheet
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>
                    Configure how you receive notifications.
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <SheetClose render={<Button variant="outline">Close</Button>}>
                    Close
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="drawer"
          title="Drawer"
          description="A bottom sheet built for touch."
        >
          <ShowcaseDemo label="drawer">
            <Drawer>
              <DrawerTrigger
                render={<Button variant="outline">Open drawer</Button>}
              />
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Move goal</DrawerTitle>
                  <DrawerDescription>
                    Set your daily activity goal.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose
                    render={<Button variant="outline">Cancel</Button>}
                  >
                    Cancel
                  </DrawerClose>
                  <Button>Submit</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="popover"
          title="Popover"
          description="A small floating panel anchored to a trigger."
        >
          <ShowcaseDemo label="popover">
            <Popover>
              <PopoverTrigger
                render={<Button variant="outline">Open popover</Button>}
              />
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Dimensions</PopoverTitle>
                  <PopoverDescription>
                    Set the dimensions for the layer.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="hover-card"
          title="Hover card"
          description="A preview revealed on hover."
        >
          <ShowcaseDemo label="hover card">
            <HoverCard>
              <HoverCardTrigger
                render={
                  <Button variant="link" className="h-auto p-0">
                    @ada
                  </Button>
                }
              />
              <HoverCardContent className="w-64">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Ada Lovelace</span>
                  <span className="text-xs text-muted-foreground">
                    Mathematician and first programmer.
                  </span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="tooltip"
          title="Tooltip"
          description="A short label on hover or focus."
        >
          <ShowcaseDemo label="tooltip">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Hover me</Button>}
              />
              <TooltipContent>This is the tooltip content.</TooltipContent>
            </Tooltip>
          </ShowcaseDemo>
        </ShowcaseSection>

        <ShowcaseSection
          id="context-menu"
          title="Context menu"
          description="Actions revealed by right click."
        >
          <ShowcaseDemo label="context menu">
            <ContextMenu>
              <ContextMenuTrigger className="flex min-h-24 w-full items-center justify-center rounded-none border border-dashed border-border text-sm text-muted-foreground">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem disabled>Forward</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Copy link</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </ShowcaseDemo>
        </ShowcaseSection>
      </div>
    </TooltipProvider>
  )
}
