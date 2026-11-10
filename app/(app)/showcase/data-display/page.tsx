"use client"

import {
  IconCheck,
  IconDownload,
  IconFile,
  IconPhoto,
} from "@tabler/icons-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Attachment,
  AttachmentActions,
  AttachmentAction,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--color-chart-1)" },
  mobile: { label: "Mobile", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 314, mobile: 240 },
]

const codeSample = `export function greet(name: string) {
  return \`Hello, \${name}!\`
}

console.log(greet("world"))`

export default function ShowcaseDataDisplayPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="table"
        title="Table"
        description="Tabular data with a caption."
      >
        <ShowcaseDemo
          label="table"
          className="block w-full overflow-x-auto p-0"
        >
          <Table>
            <TableCaption>A list of recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>$150.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="card"
        title="Card"
        description="A grouped surface with header and content."
      >
        <ShowcaseDemo label="card" className="block w-full p-0">
          <div className="w-full max-w-sm bg-card p-6 text-card-foreground">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold">Deploy preview</h3>
              <p className="text-sm text-muted-foreground">
                Every pull request gets its own URL.
              </p>
            </div>
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="avatar"
        title="Avatar"
        description="A user representation with a group variant."
      >
        <ShowcaseDemo label="avatar">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Ada Lovelace" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
            <AvatarBadge>
              <IconCheck className="size-2.5" />
            </AvatarBadge>
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>BL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>+7</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="item"
        title="Item"
        description="A row of content with media, title and actions."
      >
        <ShowcaseDemo label="item" className="block w-full">
          <ItemGroup>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <IconFile />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Quarterly report</ItemTitle>
                <ItemDescription>Updated 2 hours ago</ItemDescription>
              </ItemContent>
              <ItemContent />
            </Item>
            <Item variant="muted" size="sm">
              <ItemMedia variant="image">
                <IconPhoto />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Cover photo</ItemTitle>
                <ItemDescription>PNG, 240 KB</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="bubble"
        title="Bubble"
        description="A chat bubble with reactions."
      >
        <ShowcaseDemo label="bubble" className="flex-col items-start gap-3">
          <BubbleGroup>
            <Bubble variant="default" align="start">
              <BubbleContent>Is the deployment ready?</BubbleContent>
              <BubbleReactions>
                <Button variant="ghost" size="icon-xs" aria-label="Like">
                  <IconCheck />
                </Button>
              </BubbleReactions>
            </Bubble>
            <Bubble variant="secondary" align="end">
              <BubbleContent>Shipping it now.</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="message"
        title="Message"
        description="A chat message with avatar, header and footer."
      >
        <ShowcaseDemo label="message" className="flex-col items-stretch gap-3">
          <MessageGroup>
            <Message align="start">
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>Ada Lovelace</MessageHeader>
                <div className="rounded-none bg-muted px-4 py-3 text-sm">
                  The analytical engine weaves algebraic patterns.
                </div>
                <MessageFooter>09:41</MessageFooter>
              </MessageContent>
            </Message>
            <Message align="end">
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>YO</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <div className="rounded-none bg-primary px-4 py-3 text-sm text-primary-foreground">
                  Beautiful. Let us ship it.
                </div>
                <MessageFooter>09:42</MessageFooter>
              </MessageContent>
            </Message>
          </MessageGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="attachment"
        title="Attachment"
        description="A file card with upload state."
      >
        <ShowcaseDemo label="attachment" className="flex-col items-start gap-3">
          <Attachment className="max-w-sm">
            <AttachmentMedia variant="icon">
              <IconFile />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>report.pdf</AttachmentTitle>
              <AttachmentDescription>1.2 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Download">
                <IconDownload />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" className="max-w-sm">
            <AttachmentMedia variant="icon">
              <IconFile />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>upload.png</AttachmentTitle>
              <AttachmentDescription>Uploading…</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="code-block"
        title="Code block"
        description="A copyable snippet with a header."
      >
        <ShowcaseDemo label="code block" className="block w-full p-0">
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>greet.ts</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={codeSample} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{codeSample}</CodeBlockContent>
          </CodeBlock>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="chart"
        title="Chart"
        description="A themed area chart with tooltip."
      >
        <ShowcaseDemo label="chart" className="block w-full">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                fill="var(--color-desktop)"
                fillOpacity={0.2}
              />
              <Area
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                fill="var(--color-mobile)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="carousel"
        title="Carousel"
        description="A scrollable snap carousel with controls."
      >
        <ShowcaseDemo label="carousel" className="block w-full">
          <Carousel className="w-full max-w-md">
            <CarouselContent>
              {[1, 2, 3].map((index) => (
                <CarouselItem key={index}>
                  <div className="flex aspect-square w-full items-center justify-center border border-border bg-muted text-4xl font-semibold">
                    {index}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </Carousel>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="calendar"
        title="Calendar"
        description="A date picker built on react-day-picker."
      >
        <ShowcaseDemo label="calendar">
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} />
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
