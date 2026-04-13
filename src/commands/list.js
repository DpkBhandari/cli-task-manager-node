"use strict";

const chalk = require("chalk");
const { getTasks, getStats } = require("../utils/taskService");
const { log, printTaskTable, colors } = require("../utils/logger");

/**
 * Register the `list` command
 * @param {import('commander').Command} program
 */
const registerList = (program) => {
  program
    .command("list")
    .alias("ls")
    .description("List all tasks with optional filters")
    .option("-s, --status <status>", "Filter by status: pending | completed")
    .option("-p, --priority <priority>", "Filter by priority: low | medium | high")
    .option("-q, --search <query>", "Search tasks by title keyword")
    .option("--stats", "Show task statistics summary")
    .action(async (options) => {
      try {
        // Stats mode
        if (options.stats) {
          const stats = await getStats();
          const divider = colors.muted("─".repeat(40));
          console.log();
          console.log(divider);
          console.log(colors.brandBold ? colors.brand("  Task Statistics") : chalk.bold("  Task Statistics"));
          console.log(divider);
          console.log(`  Total Tasks    ${chalk.white.bold(stats.total)}`);
          console.log(`  ✅ Completed   ${chalk.green.bold(stats.completed)}`);
          console.log(`  ⏳ Pending     ${chalk.yellow.bold(stats.pending)}`);
          console.log(`  🔴 High Pri    ${chalk.red.bold(stats.high)}`);
          console.log(`  🟡 Medium Pri  ${chalk.yellow.bold(stats.medium)}`);
          console.log(`  🟢 Low Pri     ${chalk.green.bold(stats.low)}`);
          console.log(`  ⚠  Overdue     ${stats.overdue > 0 ? chalk.red.bold(stats.overdue) : chalk.gray("0")}`);
          console.log(divider);
          console.log();
          return;
        }

        const filters = {
          status: options.status || null,
          priority: options.priority || null,
          search: options.search || null,
        };

        // Validate filter values
        if (filters.status && !["pending", "completed"].includes(filters.status)) {
          log.error("Status must be: pending | completed");
          process.exit(1);
        }
        if (filters.priority && !["low", "medium", "high"].includes(filters.priority)) {
          log.error("Priority must be: low | medium | high");
          process.exit(1);
        }

        const tasks = await getTasks(filters);

        log.blank();

        // Show active filters
        const activeFilters = [];
        if (filters.status) activeFilters.push(`status=${chalk.cyan(filters.status)}`);
        if (filters.priority) activeFilters.push(`priority=${chalk.cyan(filters.priority)}`);
        if (filters.search) activeFilters.push(`search="${chalk.cyan(filters.search)}"`);
        if (activeFilters.length) {
          log.info(`Filters: ${activeFilters.join("  ")}`);
          log.blank();
        }

        printTaskTable(tasks);
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerList;
