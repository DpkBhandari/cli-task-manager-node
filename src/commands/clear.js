"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const { readTasks, writeTasks } = require("../storage/taskStore");
const { log } = require("../utils/logger");

/**
 * Register the `clear` command - removes all completed tasks
 * @param {import('commander').Command} program
 */
const registerClear = (program) => {
  program
    .command("clear")
    .description("Remove all completed tasks")
    .option("-a, --all", "Remove ALL tasks (pending + completed)")
    .option("-f, --force", "Skip confirmation prompt")
    .action(async (options) => {
      try {
        const tasks = await readTasks();
        const toDelete = options.all
          ? tasks
          : tasks.filter((t) => t.status === "completed");

        if (toDelete.length === 0) {
          log.warn(options.all ? "No tasks to clear." : "No completed tasks to clear.");
          return;
        }

        if (!options.force) {
          const target = options.all ? "ALL tasks" : `${toDelete.length} completed task${toDelete.length !== 1 ? "s" : ""}`;
          const { confirm } = await inquirer.prompt([
            {
              type: "confirm",
              name: "confirm",
              message: chalk.red(`This will permanently delete ${target}. Continue?`),
              default: false,
            },
          ]);

          if (!confirm) {
            log.warn("Clear cancelled.");
            return;
          }
        }

        const remaining = options.all ? [] : tasks.filter((t) => t.status !== "completed");
        await writeTasks(remaining);

        log.blank();
        log.success(`Cleared ${toDelete.length} task${toDelete.length !== 1 ? "s" : ""}.`);
        log.blank();
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerClear;
