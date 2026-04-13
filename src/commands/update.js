"use strict";

const inquirer = require("inquirer");
const { getTasks, updateTask } = require("../utils/taskService");
const { log, printTaskDetail } = require("../utils/logger");
const { PRIORITIES } = require("../utils/validators");

/**
 * Interactive update flow - prompts user to pick a task then edit fields
 */
const promptUpdate = async (preId) => {
  let taskId = preId;

  if (!taskId) {
    const tasks = await getTasks();
    if (tasks.length === 0) throw new Error("No tasks available to update.");

    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Select a task to update:",
        choices: tasks.map((t) => ({
          name: `[${t.status === "completed" ? "✅" : "⏳"}] ${t.title.slice(0, 50)} (${t.id.slice(0, 8)})`,
          value: t.id,
        })),
      },
    ]);
    taskId = selected;
  }

  const fields = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "New title (leave blank to keep):",
      default: "",
    },
    {
      type: "list",
      name: "priority",
      message: "New priority:",
      choices: [...PRIORITIES, "keep current"],
      default: "keep current",
    },
    {
      type: "input",
      name: "dueDate",
      message: "New due date YYYY-MM-DD (leave blank to keep, 'none' to clear):",
      default: "",
    },
    {
      type: "list",
      name: "status",
      message: "New status:",
      choices: ["pending", "completed", "keep current"],
      default: "keep current",
    },
  ]);

  const updates = {};
  if (fields.title.trim()) updates.title = fields.title.trim();
  if (fields.priority !== "keep current") updates.priority = fields.priority;
  if (fields.dueDate.trim() === "none") updates.dueDate = null;
  else if (fields.dueDate.trim()) updates.dueDate = fields.dueDate.trim();
  if (fields.status !== "keep current") updates.status = fields.status;

  return { taskId, updates };
};

/**
 * Register the `update` command
 * @param {import('commander').Command} program
 */
const registerUpdate = (program) => {
  program
    .command("update [id]")
    .description("Update a task by ID (interactive if no ID given)")
    .option("-t, --title <title>", "New task title")
    .option("-p, --priority <priority>", "New priority: low | medium | high")
    .option("-d, --due <date>", "New due date YYYY-MM-DD")
    .option("-s, --status <status>", "New status: pending | completed")
    .action(async (id, options) => {
      try {
        let taskId = id;
        let updates = {};

        const hasOptions = options.title || options.priority || options.due || options.status;

        if (!hasOptions || !id) {
          // Interactive mode
          const result = await promptUpdate(id);
          taskId = result.taskId;
          updates = result.updates;
        } else {
          taskId = id;
          if (options.title) updates.title = options.title;
          if (options.priority) updates.priority = options.priority;
          if (options.due) updates.dueDate = options.due;
          if (options.status) updates.status = options.status;
        }

        if (Object.keys(updates).length === 0) {
          log.warn("No changes provided.");
          return;
        }

        const updated = await updateTask(taskId, updates);
        log.blank();
        log.success("Task updated successfully!");
        printTaskDetail(updated);
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerUpdate;
