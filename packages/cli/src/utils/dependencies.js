/**
 * Dependency detection and package manager resolution utility.
 */

const fs = require("fs");
const path = require("path");

function detectPackageManager(cwd = process.cwd()) {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  return "npm";
}

function getExistingDependencies(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return { dependencies: {}, devDependencies: {}, exists: false };
  }

  try {
    const raw = fs.readFileSync(pkgPath, "utf8");
    const json = JSON.parse(raw);
    return {
      dependencies: json.dependencies || {},
      devDependencies: json.devDependencies || {},
      exists: true,
    };
  } catch {
    return { dependencies: {}, devDependencies: {}, exists: false };
  }
}

function checkMissingDependencies(requiredDeps = {}, requiredDevDeps = {}, cwd = process.cwd()) {
  const { dependencies: existingDeps, devDependencies: existingDevDeps } = getExistingDependencies(cwd);

  const missingDeps = [];
  const missingDevDeps = [];

  for (const [pkg, version] of Object.entries(requiredDeps)) {
    if (!existingDeps[pkg] && !existingDevDeps[pkg]) {
      missingDeps.push({ name: pkg, version });
    }
  }

  for (const [pkg, version] of Object.entries(requiredDevDeps)) {
    if (!existingDeps[pkg] && !existingDevDeps[pkg]) {
      missingDevDeps.push({ name: pkg, version });
    }
  }

  const pm = detectPackageManager(cwd);
  let installCmd = "";

  if (missingDeps.length > 0 || missingDevDeps.length > 0) {
    const depNames = missingDeps.map((d) => d.name).join(" ");
    const devDepNames = missingDevDeps.map((d) => d.name).join(" ");

    if (pm === "pnpm") {
      installCmd = [
        depNames ? `pnpm add ${depNames}` : "",
        devDepNames ? `pnpm add -D ${devDepNames}` : "",
      ]
        .filter(Boolean)
        .join(" && ");
    } else if (pm === "yarn") {
      installCmd = [
        depNames ? `yarn add ${depNames}` : "",
        devDepNames ? `yarn add -D ${devDepNames}` : "",
      ]
        .filter(Boolean)
        .join(" && ");
    } else if (pm === "bun") {
      installCmd = [
        depNames ? `bun add ${depNames}` : "",
        devDepNames ? `bun add -d ${devDepNames}` : "",
      ]
        .filter(Boolean)
        .join(" && ");
    } else {
      installCmd = [
        depNames ? `npm install ${depNames}` : "",
        devDepNames ? `npm install -D ${devDepNames}` : "",
      ]
        .filter(Boolean)
        .join(" && ");
    }
  }

  return {
    missingDeps,
    missingDevDeps,
    packageManager: pm,
    installCommand: installCmd,
    hasMissing: missingDeps.length > 0 || missingDevDeps.length > 0,
  };
}

module.exports = {
  detectPackageManager,
  getExistingDependencies,
  checkMissingDependencies,
};
