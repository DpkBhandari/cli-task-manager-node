# ⚡ Task CLI — CLI Task Manager

> A production-ready, developer-friendly command-line task manager built with **Node.js**, **Commander**, **Inquirer**, and **Chalk**. Stores tasks locally in a JSON file. Inspired by real-world CLI productivity tools.

Built by **InternDrive Technologies Pvt. Ltd.**

---

## 📁 Folder Structure

```
taskmanager/
├── bin/
│   └── task.js                  # CLI entry point (shebang script)
├── src/
│   ├── index.js                 # Commander program setup + command registration
│   ├── commands/
│   │   ├── add.js               # task add command
│   │   ├── list.js              # task list command
│   │   ├── update.js            # task update command
│   │   ├── delete.js            # task delete / rm command
│   │   ├── complete.js          # task complete / done command
│   │   ├── search.js            # task search / find command
│   │   └── clear.js             # task clear command
│   ├── storage/
│   │   └── taskStore.js         # JSON file read/write layer
│   └── utils/
│       ├── taskService.js       # Core business logic (add/get/update/delete)
│       ├── validators.js        # Input validation helpers
│       └── logger.js            # Chalk colors, CLI table, banner, log helpers
├── data/
│   └── tasks.json               # Auto-created task storage file
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16 or higher
- npm v7+

### 1. Install dependencies
```bash
cd taskmanager
npm install
```

### 2. Run directly (without global install)
```bash
node bin/task.js <command>
```

### 3. Install globally (recommended)
```bash
npm link
```
Now you can run `task` from anywhere in your terminal:
```bash
task list
task add "My new task"
```

### 4. Uninstall global link
```bash
npm unlink -g task-cli
```

---

## 🚀 Commands & Usage

### `task add` — Add a new task

```bash
# Quick add with title
task add "Build InternDrive dashboard"

# With priority
task add "Fix critical bug" --priority high

# With due date (YYYY-MM-DD)
task add "Submit report" --priority medium --due 2025-12-31

# Interactive mode (no title given — prompts you)
task add
```

**Options:**
| Flag | Short | Description |
|------|-------|-------------|
| `--priority <p>` | `-p` | `low` \| `medium` \| `high` (default: `medium`) |
| `--due <date>` | `-d` | Due date in `YYYY-MM-DD` format |

---

### `task list` — List all tasks

```bash
# List all tasks
task list

# Alias
task ls

# Filter by status
task list --status pending
task list --status completed

# Filter by priority
task list --priority high
task list --priority low

# Search by keyword
task list --search "api"

# Show statistics summary
task list --stats
```

**Options:**
| Flag | Short | Description |
|------|-------|-------------|
| `--status <s>` | `-s` | Filter by `pending` or `completed` |
| `--priority <p>` | `-p` | Filter by `low`, `medium`, or `high` |
| `--search <q>` | `-q` | Keyword search in title |
| `--stats` | — | Show summary statistics |

---

### `task update` — Update a task

```bash
# Interactive mode (select from list, choose fields to update)
task update

# Update specific task by ID
task update <id> --title "Updated task title"
task update <id> --priority low
task update <id> --due 2025-11-30
task update <id> --status pending

# Combine multiple updates
task update <id> --title "New title" --priority high --due 2025-12-01
```

> **Tip:** IDs are shown truncated in the table. Copy the full ID from the detail view or `data/tasks.json`.

**Options:**
| Flag | Short | Description |
|------|-------|-------------|
| `--title <t>` | `-t` | New task title |
| `--priority <p>` | `-p` | New priority |
| `--due <date>` | `-d` | New due date (`YYYY-MM-DD`) |
| `--status <s>` | `-s` | New status (`pending` or `completed`) |

---

### `task delete` — Delete a task

```bash
# Interactive mode (select from list, prompts for confirmation)
task delete

# Delete by ID (prompts for confirmation)
task delete <id>

# Alias
task rm <id>

# Skip confirmation
task delete <id> --force
```

**Options:**
| Flag | Short | Description |
|------|-------|-------------|
| `--force` | `-f` | Skip the confirmation prompt |

---

### `task complete` — Mark a task as done

```bash
# Interactive mode (shows only pending tasks)
task complete

# Mark specific task by ID
task complete <id>

# Alias
task done <id>
```

---

### `task search` — Search tasks

```bash
# Search by keyword in title
task search "api"
task find "deploy"

# Combine with filters
task search "test" --status pending
task search "dashboard" --priority high
```

**Options:**
| Flag | Short | Description |
|------|-------|-------------|
| `--status <s>` | `-s` | Also filter by status |
| `--priority <p>` | `-p` | Also filter by priority |

---

### `task clear` — Remove completed tasks

```bash
# Clear all completed tasks (prompts for confirmation)
task clear

# Clear ALL tasks (pending + completed)
task clear --all

# Skip confirmation
task clear --force
task clear --all --force
```

---

## 📋 Task Structure (tasks.json)

Each task stored in `data/tasks.json` looks like this:

```json
{
  "id": "9C1H1KNYfpPi",
  "title": "Build InternDrive dashboard",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31",
  "createdAt": "2026-04-11T12:38:00.000Z",
  "updatedAt": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique 12-char nanoid |
| `title` | string | Task title (2–120 chars) |
| `status` | string | `pending` or `completed` |
| `priority` | string | `low`, `medium`, or `high` |
| `dueDate` | string \| null | ISO date string or null |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string \| null | ISO timestamp of last update |

---

## 🎨 Features at a Glance

| Feature | Details |
|---------|---------|
| ✅ Add tasks | Title, priority, due date |
| ✅ List tasks | Colored table with all fields |
| ✅ Update tasks | Any field, interactive or by ID |
| ✅ Delete tasks | By ID or interactive, with confirmation |
| ✅ Complete tasks | Mark as done, interactive or by ID |
| ✅ Search tasks | Keyword search in title |
| ✅ Filter tasks | By status and/or priority |
| ✅ Statistics | Total, completed, pending, overdue counts |
| ✅ Clear tasks | Remove completed or all tasks |
| ✅ Colored output | Priority, status, overdue dates in color |
| ✅ Interactive mode | Inquirer prompts when IDs are omitted |
| ✅ Overdue highlight | Due dates in the past shown in red |
| ✅ Error handling | Validation errors shown cleanly |
| ✅ Global install | `npm link` for system-wide `task` command |

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| `commander` | CLI command & option parsing |
| `inquirer` | Interactive prompts |
| `chalk` | Terminal colors |
| `cli-table3` | Formatted ASCII tables |
| `nanoid` | Unique ID generation |
| `date-fns` | Date formatting and validation |

---

## 💡 Example Workflow

```bash
# Add some tasks
task add "Design database schema" --priority high --due 2025-07-01
task add "Write API endpoints" --priority high --due 2025-07-15
task add "Setup CI/CD pipeline" --priority medium
task add "Code review session" --priority low

# View all tasks
task list

# View only high priority
task list --priority high

# Search for specific work
task search "api"

# Complete a task (interactive)
task complete

# Check stats
task list --stats

# Clean up done tasks
task clear
```

---

## 📄 License

MIT © InternDrive Technologies Pvt. Ltd.
