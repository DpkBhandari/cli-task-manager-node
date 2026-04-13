"use strict";

const { Command } = require("commander");
const chalk = require("chalk");
const { printBanner } = require("./utils/logger");

const registerAdd = require("./commands/add");
const registerList = require("./commands/list");
const registerUpdate = require("./commands/update");
const registerDelete = require("./commands/delete");
const registerComplete = require("./commands/complete");
const registerSearch = require("./commands/search");
const registerClear = require("./commands/clear");

const program = new Command();

// ─── Program Metadata ─────────────────────────────────────────────────────────
program
  .name("task")
  .description(chalk.cyan("CLI Task Manager — organize your work from the terminal"))
  .version("1.0.0", "-v, --version", "Output the current version")
  .addHelpText("before", "\n" + chalk.hex("#4c6ef5").bold("  ⚡ TASK CLI — InternDrive Technologies\n"));

// ─── Register All Commands ────────────────────────────────────────────────────
registerAdd(program);
registerList(program);
registerUpdate(program);
registerDelete(program);
registerComplete(program);
registerSearch(program);
registerClear(program);

// ─── Default: show banner + help if no command given ─────────────────────────
if (process.argv.length <= 2) {
  printBanner();
  program.help();
}

// ─── Parse ────────────────────────────────────────────────────────────────────
program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red(`\n  ✖  Fatal error: ${err.message}\n`));
  process.exit(1);
});
