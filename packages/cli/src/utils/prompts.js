/**
 * Safe terminal prompt utility for user confirmation before destructive actions.
 */

const readline = require("readline");

function confirm(question, defaultValue = false) {
  // If running in CI or non-interactive pipe without TTY, respect default
  if (!process.stdin.isTTY) {
    return Promise.resolve(defaultValue);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptSuffix = defaultValue ? " [Y/n] " : " [y/N] ";

  return new Promise((resolve) => {
    rl.question(question + promptSuffix, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      if (!trimmed) {
        resolve(defaultValue);
      } else if (trimmed === "y" || trimmed === "yes") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

module.exports = {
  confirm,
};
