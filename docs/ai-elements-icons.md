# AI Elements icon mapping

The upstream AI Elements docs are written against `lucide-react`. This repo uses
`@tabler/icons-react` (`components.json` → `iconLibrary: "tabler"`), so every
icon in a pattern is swapped for its Tabler equivalent. Use this table; do not
introduce `lucide-react` as a dependency.

| lucide-react        | @tabler/icons-react |
| ------------------- | -------------------- |
| `ArrowUpIcon`       | `IconArrowUp`        |
| `ArrowUpRightIcon`  | `IconArrowUpRight`   |
| `CheckIcon`         | `IconCheck`          |
| `ChevronDownIcon`   | `IconChevronDown`    |
| `ChevronRightIcon`  | `IconChevronRight`   |
| `CircleAlertIcon`   | `IconAlertCircle`    |
| `CircleCheckIcon`   | `IconCircleCheck`    |
| `CircleDashedIcon`  | `IconCircleDashed`   |
| `CircleDotIcon`     | `IconCircleDot`      |
| `CircleIcon`        | `IconCircle`         |
| `CircleXIcon`       | `IconCircleX`        |
| `CopyIcon`          | `IconCopy`           |
| `FileCodeIcon`      | `IconFileCode`       |
| `FileIcon`          | `IconFile`           |
| `FileTextIcon`      | `IconFileText`       |
| `FlaskConicalIcon`  | `IconFlask`          |
| `FolderIcon`        | `IconFolder`         |
| `GlobeIcon`         | `IconWorld`          |
| `LayersIcon`        | `IconStack2`         |
| `ListChecksIcon`    | `IconListCheck`      |
| `ListTodoIcon`      | `IconChecklist`      |
| `LoaderCircleIcon`  | `IconLoader`         |
| `MessageCircleDashedIcon` | `IconMessageCircle` |
| `PaperclipIcon`     | `IconPaperclip`      |
| `PencilIcon`        | `IconPencil`         |
| `PlusIcon`          | `IconPlus`           |
| `RefreshCcwIcon`    | `IconRefresh`        |
| `RotateCwIcon`      | `IconRotate`         |
| `RouteIcon`         | `IconRoute`          |
| `TelescopeIcon`     | `IconTelescope`      |
| `TerminalIcon`      | `IconTerminal`       |
| `ThumbsDownIcon`    | `IconThumbDown`      |
| `ThumbsUpIcon`      | `IconThumbUp`        |
| `XIcon`             | `IconX`              |

Four names do not exist in Tabler under the obvious spelling, so they are
mapped by meaning: `CircleAlertIcon` → `IconAlertCircle`, `LayersIcon` →
`IconStack2`, `ListTodoIcon` → `IconChecklist`, and `MessageCircleDashedIcon` →
`IconMessageCircle`. Every name in this table was verified to exist in
`@tabler/icons-react@3.51.0`.
