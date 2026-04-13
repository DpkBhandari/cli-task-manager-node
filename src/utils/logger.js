"use strict";

const chalk = require("chalk");
const Table = require("cli-table3");
const { format, parseISO, isValid, isPast } = require("date-fns");

// ─── Color Palette ─────────────────────────────────────────────────────────────
const colors = {
  success: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.cyan,
  muted: chalk.gray,
  bold: chalk.white.bold,
  brand: chalk.hex("#4c6ef5"),
  brandBold: chalk.hex("#4c6ef5").bold,
};

// ─── Priority Colors ──────────────────────────────────────────────────────────
const priorityColor = {
  high: chalk.red.bold,
  medium: chalk.yellow,
  low: chalk.green,
};

const priorityIcon = { high: "🔴", medium: "🟡", low: "🟢" };

// ─── Status Colors ────────────────────────────────────────────────────────────
const statusColor = {
  completed: chalk.green,
  pending: chalk.yellow,
};

const statusIcon = { completed: "✅", pending: "⏳" };

// ─── Log Helpers ──────────────────────────────────────────────────────────────
const log = {
  success: (msg) => console.log(colors.success(`✔  ${msg}`)),
  error: (msg) => console.log(colors.error(`✖  ${msg}`)),
  warn: (msg) => console.log(colors.warn(`⚠  ${msg}`)),
  info: (msg) => console.log(colors.info(`ℹ  ${msg}`)),
  blank: () => console.log(),
};

// ─── Format due date with overdue highlight ───────────────────────────────────
const formatDueDate = (dateStr) => {
  if (!dateStr) return colors.muted("—");
  try {
    const parsed = parseISO(dateStr);
    if (!isValid(parsed)) return colors.muted("—");
    const formatted = format(parsed, "MMM d, yyyy");
    return isPast(parsed) ? chalk.red(`${formatted} ⚠`) : chalk.cyan(formatted);
  } catch {
    return colors.muted("—");
  }
};

// ─── Format task table ────────────────────────────────────────────────────────
const printTaskTable = (tasks) => {
  if (tasks.length === 0) {
    log.warn("No tasks found.");
    return;
  }

  const table = new Table({
    head: [
      colors.brand("ID"),
      colors.brand("Title"),
      colors.brand("Status"),
      colors.brand("Priority"),
      colors.brand("Due Date"),
      colors.brand("Created"),
    ],
    colWidths: [12, 36, 14, 12, 18, 16],
    wordWrap: true,
    style: { head: [], border: ["gray"] },
  });

  tasks.forEach((task) => {
    const shortId = task.id.slice(0, 8);
    const status = statusIcon[task.status] + " " + (statusColor[task.status] || chalk.white)(task.status);
    const priority = task.priority
      ? priorityIcon[task.priority] + " " + (priorityColor[task.priority] || chalk.white)(task.priority)
      : colors.muted("—");
    const title =
      task.status === "completed" ? chalk.strikethrough.gray(task.title) : chalk.white(task.title);
    const created = format(parseISO(task.createdAt), "MMM d, yyyy");

    table.push([colors.muted(shortId), title, status, priority, formatDueDate(task.dueDate), colors.muted(created)]);
  });

  console.log(table.toString());
  log.blank();
  log.info(`Showing ${tasks.length} task${tasks.length !== 1 ? "s" : ""}`);
};

// ─── Print single task detail ─────────────────────────────────────────────────
const printTaskDetail = (task) => {
  const divider = colors.muted("─".repeat(48));
  console.log(divider);
  console.log(colors.brandBold("  Task Detail"));
  console.log(divider);
  console.log(`  ${chalk.gray("ID")}        ${colors.muted(task.id)}`);
  console.log(`  ${chalk.gray("Title")}     ${chalk.white.bold(task.title)}`);
  console.log(
    `  ${chalk.gray("Status")}    ${statusIcon[task.status]} ${(statusColor[task.status] || chalk.white)(task.status)}`
  );
  if (task.priority) {
    console.log(
      `  ${chalk.gray("Priority")}  ${priorityIcon[task.priority]} ${(priorityColor[task.priority] || chalk.white)(task.priority)}`
    );
  }
  if (task.dueDate) {
    console.log(`  ${chalk.gray("Due Date")}  ${formatDueDate(task.dueDate)}`);
  }
  console.log(`  ${chalk.gray("Created")}   ${colors.muted(format(parseISO(task.createdAt), "MMM d, yyyy HH:mm"))}`);
  if (task.updatedAt) {
    console.log(`  ${chalk.gray("Updated")}   ${colors.muted(format(parseISO(task.updatedAt), "MMM d, yyyy HH:mm"))}`);
  }
  console.log(divider);
};

// ─── Banner ───────────────────────────────────────────────────────────────────
const printBanner = () => {
  console.log();
  console.log(colors.brandBold("  ████████╗ █████╗ ███████╗██╗  ██╗"));
  console.log(colors.brandBold("     ██╔══╝██╔══██╗██╔════╝██║ ██╔╝"));
  console.log(colors.brandBold("     ██║   ███████║███████╗█████╔╝ "));
  console.log(colors.brandBold("     ██║   ██╔══██║╚════██║██╔═██╗ "));
  console.log(colors.brandBold("     ██║   ██║  ██║███████║██║  ██╗"));
  console.log(colors.brandBold("     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"));
  console.log();
  console.log(colors.muted("  CLI Task Manager · v1.0.0 · InternDrive"));
  console.log();
};

module.exports = {
  log,
  colors,
  priorityColor,
  priorityIcon,
  statusColor,
  statusIcon,
  printTaskTable,
  printTaskDetail,
  printBanner,
  formatDueDate,
};
