"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const { getTasks, completeTask } = require("../utils/taskService");
const { log, printTaskDetail } = require("../utils/logger");

/**
 * Interactive complete flow (only shows pending tasks)
 */
const promptComplete = async (preId) => {
  if (preId) return preId;

  const tasks = await getTasks({ status: "pending" });
  if (tasks.length === 0) throw new Error("No pending tasks to complete. 🎉");

  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: "Mark which task as completed?",
      choices: tasks.map((t) => ({
        name: `⏳ ${t.title.slice(0, 55)} (${t.id.slice(0, 8)})`,
        value: t.id,
      })),
    },
  ]);

  return selected;
};

/**
 * Register the `complete` command
 * @param {import('commander').Command} program
 */
const registerComplete = (program) => {
  program
    .command("complete [id]")
    .alias("done")
    .description("Mark a task as completed (interactive if no ID given)")
    .action(async (id) => {
      try {
        const taskId = await promptComplete(id);
        const task = await completeTask(taskId);
        log.blank();
        log.success(`Task marked as completed! 🎉`);
        printTaskDetail(task);
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerComplete;
