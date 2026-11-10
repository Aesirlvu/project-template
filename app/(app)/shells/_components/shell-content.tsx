import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function ShellContent({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 lg:p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>Filter the workspace records.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Search records" aria-label="Search records" />
            <div className="flex items-center gap-2">
              <Button size="sm">Apply</Button>
              <Button size="sm" variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Requests served this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">12,480</p>
            <p className="text-xs text-muted-foreground">
              +8.2% compared to last month
            </p>
          </CardContent>
          <CardFooter>
            <Separator className="mb-3" />
            <Button variant="link" size="sm" className="px-0">
              View the full report
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            Everything that happened in the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          {[
            "Ada Lovelace published a new registry item.",
            "The engineering team shipped the showcase route.",
            "Two new members joined the workspace.",
          ].map((entry) => (
            <div key={entry} className="flex items-center gap-3">
              <span className="size-2 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">{entry}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
