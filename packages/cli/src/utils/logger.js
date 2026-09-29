/**
 * Terminal logger with standard ANSI styling and clear status icons.
 */

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  
  // Foregrounds
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

// Check if terminal supports color
const supportsColor = process.stdout.isTTY && !process.env.NO_COLOR;

function colorize(color, text) {
  if (!supportsColor) return text;
  return `${colors[color] || ""}${text}${colors.reset}`;
}

module.exports = {
  c: colorize,
  
  success(msg) {
    console.log(`${colorize("green", "✔")} ${msg}`);
  },

  error(msg) {
    console.error(`${colorize("red", "✖")} ${colorize("bold", msg)}`);
  },

  warn(msg) {
    console.log(`${colorize("yellow", "⚠")} ${msg}`);
  },

  info(msg) {
    console.log(`${colorize("cyan", "ℹ")} ${msg}`);
  },

  step(msg) {
    console.log(`${colorize("magenta", "✦")} ${msg}`);
  },

  banner() {
    console.log(`
${colorize("cyan", "  ____  _                               _             _   _ ___ ")}
${colorize("cyan", " |  _ \\(_)_ __ ___   ___ _ __  ___(_) ___  _ __ | | | |_ _|")}
${colorize("magenta", " | | | | | '_ ` _ \\ / _ \\ '_ \\/ __| |/ _ \\| '_ \\| | | || | ")}
${colorize("magenta", " | |_| | | | | | | |  __/ | | \\__ \\ | (_) | | | | |_| || | ")}
${colorize("cyan", " |____/|_|_| |_| |_|\\___|_| |_|___/_|\\___/|_| |_|\\___/|___|")}
${colorize("gray", " DimensionUI CLI — Official Component & Template Registry Client")}
`);
  },

  table(headers, rows) {
    const colWidths = headers.map((h, i) => {
      let max = h.length;
      for (const row of rows) {
        const cell = String(row[i] || "");
        if (cell.length > max) max = cell.length;
      }
      return Math.min(max + 2, 40);
    });

    const headerStr = headers
      .map((h, i) => colorize("bold", h.padEnd(colWidths[i])))
      .join("  ");
    const sepStr = colWidths.map((w) => "─".repeat(w)).join("  ");

    console.log(headerStr);
    console.log(colorize("gray", sepStr));

    for (const row of rows) {
      const rowStr = row
        .map((cell, i) => String(cell || "").padEnd(colWidths[i]))
        .join("  ");
      console.log(rowStr);
    }
  }
};
