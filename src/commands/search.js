"use strict";

const { getTasks } = require("../utils/taskService");
const { log, printTaskTable } = require("../utils/logger");

/**
 * Register the `search` command
 * @param {import('commander').Command} program
 */
const registerSearch = (program) => {
  program
    .command("search <query>")
    .alias("find")
    .description("Search tasks by title keyword")
    .option("-s, --status <status>", "Also filter by status: pending | completed")
    .option("-p, --priority <priority>", "Also filter by priority: low | medium | high")
    .action(async (query, options) => {
      try {
        if (!query || query.trim().length === 0) {
          log.error("Search query cannot be empty.");
          process.exit(1);
        }

        const tasks = await getTasks({
          search: query.trim(),
          status: options.status || null,
          priority: options.priority || null,
        });

        log.blank();
        log.info(`Search results for: "${query}"`);
        log.blank();
        printTaskTable(tasks);
      } catch (err) {
        log.error(err.message);
        process.exit(1);
      }
    });
};

module.exports = registerSearch;
