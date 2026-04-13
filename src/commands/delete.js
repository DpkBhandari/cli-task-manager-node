"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const { getTasks, deleteTask } = require("../utils/taskService");
const { log, colors } = require("../utils/logger");

/**
 * Interactive delete flow
 */
const promptDelete = async (preId) => {
  if (preId) return preId;

  const tasks = await getTasks();
  if (tasks.length === 0) throw new Error("No tasks available to delete.");

  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: "Select a task to delete:",
      choices: tasks.map((t) => ({
        name: `[${t.status === "completed" ? "✅" : "⏳"}] ${t.title.slice(0, 50)} (${t.id.slice(0, 8)})`,
        value: t.id,
      })),
    },
  ]);

  return selected;
};

/**
 * Register the `delete` command
 * @param {import('commander').Command} program
 */
const registerDelete = (program) => {
  program
    .command("delete [id]")
    .alias("rm")
    .description("Delete a task by ID (interactive if no ID given)")
    .option("-f, --force", "Skip confirmation prompt")
    .action(async (id, options) => {
      try {
        const taskId = await promptDelete(id);

        if (!options.force) {
          const { confirm } = await inquirer.prompt([
            {
              type: "confirm",
              name: "confirm",
              message: chalk.red(`Are you sure you want to delete task ${chalk.bold(taskId.slice(0, 8))}?`),
              default: false,
            },
          ]);

          if (!confirm) {
            log.warn("Delete cancelled.");
            return;
          }
        }

        const removed = await deleteTask(taskId);
        log.blank();
        log.success(`Task "${chalk.white.bold(removed.title)}" deleted.`);
        log.blank();
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerDelete;
