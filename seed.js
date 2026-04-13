#!/usr/bin/env node
/**
 * Seed script — populates tasks.json with sample data for demo/testing
 * Usage: node seed.js
 */
"use strict";

const { addTask } = require("./src/utils/taskService");
const { readTasks, writeTasks } = require("./src/storage/taskStore");
const chalk = require("chalk");

const sampleTasks = [
  { title: "Set up Node.js project structure",  priority: "high",   dueDate: "2025-05-01" },
  { title: "Build REST API with Express",        priority: "high",   dueDate: "2025-05-10" },
  { title: "Integrate MongoDB with Mongoose",    priority: "high",   dueDate: "2025-05-15" },
  { title: "Write unit tests for controllers",   priority: "medium", dueDate: "2025-06-01" },
  { title: "Add rate limiting middleware",        priority: "medium", dueDate: null },
  { title: "Configure CI/CD pipeline",           priority: "medium", dueDate: "2025-06-15" },
  { title: "Deploy to production server",        priority: "high",   dueDate: "2025-07-01" },
  { title: "Update API documentation",           priority: "low",    dueDate: null },
  { title: "Code review with team",              priority: "low",    dueDate: null },
  { title: "Performance audit and optimization", priority: "medium", dueDate: "2025-08-01" },
];

(async () => {
  console.log(chalk.cyan("\n  Seeding sample tasks...\n"));
  await writeTasks([]); // Clear existing

  for (const task of sampleTasks) {
    const created = await addTask(task);
    console.log(chalk.green(`  ✔ ${created.title}`));
  }

  console.log(chalk.cyan(`\n  ✅ Seeded ${sampleTasks.length} tasks into data/tasks.json\n`));
  console.log(chalk.gray('  Run: node bin/task.js list\n'));
})();
