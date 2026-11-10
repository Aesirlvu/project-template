"use client"

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconLoader,
  IconSearch,
} from "@tabler/icons-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import {
  QuestionnaireActions,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireTitle,
  Questionnaire as QuestionnaireRoot,
} from "@/components/ui/questionnaire"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Toaster, toast } from "@/components/ui/toast"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

export default function ShowcaseFeedbackPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="alert"
        title="Alert"
        description="An inline message with an optional action."
      >
        <ShowcaseDemo label="variants" className="flex-col items-stretch gap-3">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              The card was declined. Try a different payment method.
            </AlertDescription>
            <AlertAction>
              <Button variant="outline" size="sm">
                Retry
              </Button>
            </AlertAction>
          </Alert>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="toast"
        title="Toast"
        description="A transient notification anchored to the viewport."
      >
        <ShowcaseDemo label="toast">
          <Button
            variant="outline"
            onClick={() => {
              toast.add({
                title: "Deployment started",
                description: "Your build is running on the preview.",
                type: "success",
              })
            }}
          >
            Show toast
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.add({
                title: "Something went wrong",
                description: "Check the logs for more detail.",
                type: "error",
              })
            }}
          >
            Show error toast
          </Button>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="progress"
        title="Progress"
        description="A determinate bar for long running work."
      >
        <ShowcaseDemo label="progress" className="flex-col items-stretch gap-4">
          <Progress value={35} />
          <Progress value={100} />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="spinner"
        title="Spinner"
        description="An indeterminate loading indicator."
      >
        <ShowcaseDemo label="spinner">
          <Spinner />
          <Spinner className="size-8" />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="skeleton"
        title="Skeleton"
        description="A placeholder that mirrors the final layout."
      >
        <ShowcaseDemo label="skeleton" className="flex-col items-stretch gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="empty"
        title="Empty"
        description="A zero-data state with a call to action."
      >
        <ShowcaseDemo label="empty" className="block w-full">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconSearch />
              </EmptyMedia>
              <EmptyTitle>No results</EmptyTitle>
              <EmptyDescription>
                Try adjusting your filters or search terms.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm">
                Clear filters
              </Button>
            </EmptyContent>
          </Empty>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="questionnaire"
        title="Questionnaire"
        description="A multi-step form driven by a question definition."
      >
        <ShowcaseDemo label="questionnaire" className="block w-full">
          <QuestionnaireRoot
            items={[
              {
                name: "stack",
                required: true,
                choices: [
                  { value: "next" },
                  { value: "remix" },
                  { value: "astro" },
                ],
              },
              {
                name: "notes",
                choices: [{ value: "notes" }],
              },
            ]}
          >
            <QuestionnaireProgress />
            <QuestionnaireItem name="stack" required>
              <QuestionnaireTitle>
                Which stack do you want to start with?
              </QuestionnaireTitle>
              <QuestionnaireDescription>
                Pick one. You can change it later.
              </QuestionnaireDescription>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="next">
                  Next.js
                  <QuestionnaireChoiceDescription>
                    App Router, server components.
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
                <QuestionnaireChoice value="remix">
                  Remix
                  <QuestionnaireChoiceDescription>
                    Nested routes, loaders.
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
                <QuestionnaireChoice value="astro">
                  Astro
                  <QuestionnaireChoiceDescription>
                    Content first, islands.
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireItem name="notes">
              <QuestionnaireTitle>
                Anything else we should know?
              </QuestionnaireTitle>
              <QuestionnaireDescription>
                Optional. Tell us about your project.
              </QuestionnaireDescription>
              <QuestionnaireInput placeholder="A short note" />
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnairePrevious>Back</QuestionnairePrevious>
              <QuestionnaireSkip>Skip</QuestionnaireSkip>
              <QuestionnaireNext>Next</QuestionnaireNext>
            </QuestionnaireActions>
          </QuestionnaireRoot>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="trace"
        title="Trace"
        description="A vertical timeline of steps with expandable detail."
      >
        <ShowcaseDemo label="trace" className="block w-full">
          <Trace>
            <TraceLine status="running">
              <TraceIcon>
                <IconLoader className="animate-spin" />
              </TraceIcon>
              <TraceTitle>Installing dependencies</TraceTitle>
            </TraceLine>
            <TraceLine status="pending">
              <TraceIcon>
                <IconInfoCircle />
              </TraceIcon>
              <TraceTitle>Building the app</TraceTitle>
            </TraceLine>
            <TraceLine status="error">
              <TraceIcon>
                <IconAlertTriangle />
              </TraceIcon>
              <TraceTitle>Running migrations</TraceTitle>
              <TraceDescription>Connection refused.</TraceDescription>
            </TraceLine>
            <TraceLine status="pending">
              <TraceIcon>
                <IconCircleCheck />
              </TraceIcon>
              <TraceCollapsible>
                <TraceCollapsibleTrigger>
                  Deploying preview
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <TraceDescription>
                    The preview URL is printed once the build finishes.
                  </TraceDescription>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </TraceLine>
          </Trace>
        </ShowcaseDemo>
      </ShowcaseSection>

      <Toaster />
    </div>
  )
}
