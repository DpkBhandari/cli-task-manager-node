"use strict";

const inquirer = require("inquirer");
const { addTask } = require("../utils/taskService");
const { log, printTaskDetail } = require("../utils/logger");
const { PRIORITIES } = require("../utils/validators");

/**
 * Interactive add if title not provided
 */
const promptAdd = async () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Task title:",
      validate: (v) => (v.trim().length >= 2 ? true : "Title must be at least 2 characters."),
    },
    {
      type: "list",
      name: "priority",
      message: "Priority:",
      choices: PRIORITIES,
      default: "medium",
    },
    {
      type: "input",
      name: "dueDate",
      message: "Due date (YYYY-MM-DD, optional):",
      default: "",
    },
  ]);
};

/**
 * Register the `add` command
 * @param {import('commander').Command} program
 */
const registerAdd = (program) => {
  program
    .command("add [title]")
    .description("Add a new task")
    .option("-p, --priority <priority>", "Priority: low | medium | high", "medium")
    .option("-d, --due <date>", "Due date in YYYY-MM-DD format")
    .action(async (title, options) => {
      try {
        let taskData = { title, priority: options.priority, dueDate: options.due || null };

        // If no title, go interactive
        if (!title) {
          const answers = await promptAdd();
          taskData = {
            title: answers.title,
            priority: answers.priority,
            dueDate: answers.dueDate.trim() || null,
          };
        }

        const task = await addTask(taskData);
        log.blank();
        log.success(`Task added successfully!`);
        printTaskDetail(task);
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerAdd;
