"use client"

import { IconSearch, IconUser } from "@tabler/icons-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { ShowcaseDemo, ShowcaseSection } from "../_components/showcase-section"

export default function ShowcaseFormsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <ShowcaseSection
        id="input"
        title="Input"
        description="Text inputs, labels and textareas."
      >
        <ShowcaseDemo label="text input">
          <div className="w-full max-w-sm">
            <Input placeholder="you@example.com" />
          </div>
        </ShowcaseDemo>

        <ShowcaseDemo label="with label">
          <div className="flex w-full max-w-sm flex-col gap-2">
            <Label htmlFor="showcase-email">Email</Label>
            <Input id="showcase-email" placeholder="you@example.com" />
          </div>
        </ShowcaseDemo>

        <ShowcaseDemo label="textarea">
          <div className="w-full max-w-sm">
            <Textarea placeholder="Tell us what you think" />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="select"
        title="Select"
        description="A styled listbox and the native alternative."
      >
        <ShowcaseDemo label="select">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pick a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="cherry">Cherry</SelectItem>
            </SelectContent>
          </Select>
        </ShowcaseDemo>

        <ShowcaseDemo label="native select">
          <NativeSelect>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
          </NativeSelect>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="choice"
        title="Checkbox, radio and switch"
        description="Binary and exclusive choices."
      >
        <ShowcaseDemo label="checkbox">
          <Checkbox defaultChecked aria-label="Accept terms" />
          <Checkbox aria-label="Disabled" disabled />
        </ShowcaseDemo>

        <ShowcaseDemo label="radio group">
          <RadioGroup defaultValue="comfortable" aria-label="Density">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="density-compact" />
              <Label htmlFor="density-compact">Compact</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="density-comfortable" />
              <Label htmlFor="density-comfortable">Comfortable</Label>
            </div>
          </RadioGroup>
        </ShowcaseDemo>

        <ShowcaseDemo label="switch">
          <Switch defaultChecked aria-label="Airplane mode" />
          <Switch size="sm" aria-label="Small switch" />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="slider"
        title="Slider"
        description="A single value or a range."
      >
        <ShowcaseDemo label="single value" className="block w-full">
          <Slider defaultValue={40} aria-label="Volume" />
        </ShowcaseDemo>

        <ShowcaseDemo label="range" className="block w-full">
          <Slider defaultValue={[20, 70]} aria-label="Price range" />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="input-group"
        title="Input group"
        description="Inputs with leading, trailing and inline addons."
      >
        <ShowcaseDemo label="with button" className="block w-full">
          <InputGroup>
            <InputGroupInput placeholder="Search" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" aria-label="Search">
                <IconSearch />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </ShowcaseDemo>

        <ShowcaseDemo label="with text addon" className="block w-full">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="handle" />
          </InputGroup>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="field"
        title="Field"
        description="Label, description and error wiring for a control."
      >
        <ShowcaseDemo label="field set" className="block w-full">
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="showcase-name">
                  <FieldTitle>Name</FieldTitle>
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <IconUser className="size-4 text-muted-foreground" />
                  <Input id="showcase-name" defaultValue="Ada Lovelace" />
                </div>
                <FieldDescription>
                  Shown on your public profile.
                </FieldDescription>
              </Field>
              <Field data-invalid="true">
                <FieldLabel htmlFor="showcase-handle">Handle</FieldLabel>
                <Input id="showcase-handle" defaultValue="@ada" />
                <FieldError>Handle is already taken.</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="combobox"
        title="Combobox"
        description="Filterable selection with a searchable list."
      >
        <ShowcaseDemo label="combobox" className="block w-full">
          <Combobox>
            <ComboboxInput placeholder="Search languages" />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxItem value="ts">TypeScript</ComboboxItem>
                <ComboboxItem value="js">JavaScript</ComboboxItem>
                <ComboboxItem value="rs">Rust</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        id="input-otp"
        title="Input OTP"
        description="One-time passcode entry."
      >
        <ShowcaseDemo label="otp">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </ShowcaseDemo>
      </ShowcaseSection>
    </div>
  )
}
