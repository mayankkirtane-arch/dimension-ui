#!/usr/bin/env node

/**
 * DimensionUI CLI Entrypoint
 * Usage:
 *   npx dimensionui <command> [options]
 * Commands:
 *   add <name>      Install a template, block, component, or theme
 *   list            List available resources from the registry
 *   info <name>     Display metadata, dependencies, and license details
 */

const { addCommand } = require("../src/commands/add");
const { listCommand } = require("../src/commands/list");
const { infoCommand } = require("../src/commands/info");
const logger = require("../src/utils/logger");
const pkg = require("../package.json");

function parseArgs(args) {
  const parsed = {
    command: null,
    positionals: [],
    options: {},
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      parsed.options.help = true;
    } else if (arg === "--version" || arg === "-v") {
      parsed.options.version = true;
    } else if (arg === "--yes" || arg === "-y") {
      parsed.options.yes = true;
    } else if (arg === "--overwrite") {
      parsed.options.overwrite = true;
    } else if (arg === "--dry-run") {
      parsed.options.dryRun = true;
    } else if (arg === "--json") {
      parsed.options.json = true;
    } else if (arg === "--registry" || arg === "-r") {
      parsed.options.registry = args[++i];
    } else if (arg === "--cwd") {
      parsed.options.cwd = args[++i];
    } else if (arg === "--type" || arg === "-t") {
      parsed.options.type = args[++i];
    } else if (arg === "--tier") {
      parsed.options.tier = args[++i];
    } else if (arg === "--search" || arg === "-s") {
      parsed.options.search = args[++i];
    } else if (arg === "--token") {
      parsed.options.token = args[++i];
    } else if (arg.startsWith("-")) {
      // Flag without recognized handler
      parsed.options[arg.replace(/^-+/, "")] = true;
    } else {
      if (!parsed.command) {
        parsed.command = arg;
      } else {
        parsed.positionals.push(arg);
      }
    }
    i++;
  }

  return parsed;
}

function showHelp() {
  logger.banner();
  console.log(`
${logger.c("bold", "USAGE:")}
  ${logger.c("cyan", "npx dimensionui")} <command> [arguments] [options]

${logger.c("bold", "COMMANDS:")}
  ${logger.c("green", "add <name>")}       Install a resource into your project
  ${logger.c("green", "list")}             List available resources from the registry
  ${logger.c("green", "info <name>")}      Inspect resource metadata, files & dependencies

${logger.c("bold", "OPTIONS:")}
  -y, --yes          Skip confirmation prompts
  --overwrite        Overwrite existing files without prompting
  --dry-run          Simulate installation without writing to disk
  --cwd <path>       Target project directory (default: current working directory)
  -r, --registry <url> Custom registry URL (default: http://localhost:3000)
  --json             Output results as raw JSON
  -v, --version      Display CLI version
  -h, --help         Display this help guide

${logger.c("bold", "EXAMPLES:")}
  ${logger.c("gray", "# List all free resources")}
  npx dimensionui list --tier free

  ${logger.c("gray", "# Inspect a template before installing")}
  npx dimensionui info aether-ai-saas

  ${logger.c("gray", "# Install a free starter template into your Next.js app")}
  npx dimensionui add aether-ai-saas

  ${logger.c("gray", "# Install a 3D component block")}
  npx dimensionui add orbital-hero
`);
}

async function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  if (parsed.options.version) {
    console.log(`dimensionui v${pkg.version}`);
    process.exit(0);
  }

  if (parsed.options.help || !parsed.command) {
    showHelp();
    process.exit(parsed.options.help ? 0 : 1);
  }

  let code = 0;

  switch (parsed.command.toLowerCase()) {
    case "list":
    case "ls":
      code = await listCommand(parsed.options);
      break;

    case "info":
    case "show":
      code = await infoCommand(parsed.positionals[0], parsed.options);
      break;

    case "add":
    case "install":
      code = await addCommand(parsed.positionals[0], parsed.options);
      break;

    default:
      logger.error(`Unknown command '${parsed.command}'.`);
      console.log(`Run ${logger.c("cyan", "npx dimensionui --help")} to see all available commands.`);
      code = 1;
      break;
  }

  process.exit(code);
}

main().catch((err) => {
  logger.error(err.message || String(err));
  process.exit(1);
});
