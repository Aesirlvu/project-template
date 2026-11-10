"use client"

import {
  IconChevronRight,
  IconDots,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"
import { ShowcaseSidebar } from "../_components/showcase-sidebar"

export default function ShowcaseNavigationPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="tabs"
        title="Tabs"
        description="Horizontal and vertical tab sets."
      >
        <ShowcaseDemo label="horizontal">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3">
              The overview panel.
            </TabsContent>
            <TabsContent value="activity" className="pt-3">
              The activity panel.
            </TabsContent>
            <TabsContent value="settings" className="pt-3">
              The settings panel.
            </TabsContent>
          </Tabs>
        </ShowcaseDemo>

        <ShowcaseDemo label="vertical">
          <Tabs orientation="vertical" defaultValue="a" className="w-full">
            <TabsList>
              <TabsTrigger value="a">First</TabsTrigger>
              <TabsTrigger value="b">Second</TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="pt-3">
              First panel.
            </TabsContent>
            <TabsContent value="b" className="pt-3">
              Second panel.
            </TabsContent>
          </Tabs>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="breadcrumb"
        title="Breadcrumb"
        description="Where the user currently is."
      >
        <ShowcaseDemo label="breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/showcase">Showcase</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <IconChevronRight className="size-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/showcase/navigation">
                  Navigation
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <IconChevronRight className="size-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Current</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="pagination"
        title="Pagination"
        description="Page navigation for lists."
      >
        <ShowcaseDemo label="pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">10</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="navigation-menu"
        title="Navigation menu"
        description="A top navigation bar with flyout panels."
      >
        <ShowcaseDemo label="navigation menu">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-64 gap-1">
                    <li>
                      <NavigationMenuLink href="#">
                        Analytics
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#">
                        Automation
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#">
                        Integrations
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-64 gap-1">
                    <li>
                      <NavigationMenuLink href="#">About</NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#">Careers</NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="dropdown-menu"
        title="Dropdown menu"
        description="Actions and options revealed on demand."
      >
        <ShowcaseDemo label="dropdown menu">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline">Open menu</Button>}
            />
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Delete account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShowcaseDemo>

        <ShowcaseDemo label="icon trigger">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="More actions"
                >
                  <IconDots />
                </Button>
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShowcaseDemo>
      </ShowcaseSection>

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
        id="command"
        title="Command"
        description="A searchable palette of actions."
      >
        <ShowcaseDemo label="command palette" className="block w-full">
          <Command className="rounded-none border border-border">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <IconSearch />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <IconSettings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Projects">
                <CommandItem>Design system</CommandItem>
                <CommandItem>Marketing site</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
