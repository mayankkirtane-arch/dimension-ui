/**
 * Command: dimensionui add <name>
 * Downloads and installs authorized templates, blocks, or components into the target project.
 */

const fs = require("fs");
const path = require("path");
const { RegistryClient } = require("../utils/registry-client");
const { checkMissingDependencies } = require("../utils/dependencies");
const { confirm } = require("../utils/prompts");
const logger = require("../utils/logger");

async function addCommand(name, options = {}) {
  if (!name || typeof name !== "string") {
    logger.error("Please specify a resource name to add. Example: npx dimensionui add aether-ai-saas");
    return 1;
  }

  const client = new RegistryClient(options.registry);
  const targetCwd = path.resolve(options.cwd || process.cwd());
  const skipConfirm = Boolean(options.yes || options.y);
  const forceOverwrite = Boolean(options.overwrite);
  const isDryRun = Boolean(options.dryRun);

  try {
    // 1. Fetch manifest from registry
    logger.step(`Fetching '${name}' from registry...`);
    const manifest = await client.getManifest(name, {
      authHeader: options.token ? `Bearer ${options.token}` : undefined,
    });

    logger.success(`Found ${manifest.title} (v${manifest.version})`);

    // 2. Authorization / Commercial Resource Gate
    const isCommercial = manifest.access === "commercial" || manifest.license.tier !== "free";
    const hasLockedFiles = manifest.files.some((f) => f.locked || f.content === undefined);

    if (isCommercial && hasLockedFiles) {
      logger.error(`'${manifest.name}' is a commercial resource (${manifest.license.price}).`);
      logger.info(`Commercial resources require purchase or an active license authorization.`);
      logger.info(`View details & purchase at: https://dimensionui.com/template/${manifest.name}`);
      logger.info(`To download your purchased source bundle, sign in at: https://dimensionui.com/login`);
      return 1;
    }

    if (manifest.files.length === 0) {
      logger.warn(`Resource '${manifest.name}' contains no installable files.`);
      return 0;
    }

    // 3. Dependency Detection
    logger.step("Checking dependencies...");
    const depCheck = checkMissingDependencies(
      manifest.dependencies || {},
      manifest.devDependencies || {},
      targetCwd
    );

    if (depCheck.hasMissing) {
      logger.warn("Some dependencies required by this component are not installed in your project:");
      if (depCheck.missingDeps.length > 0) {
        console.log(`   Dependencies:    ${depCheck.missingDeps.map((d) => d.name).join(", ")}`);
      }
      if (depCheck.missingDevDeps.length > 0) {
        console.log(`   DevDependencies: ${depCheck.missingDevDeps.map((d) => d.name).join(", ")}`);
      }
    } else {
      logger.success("All required dependencies are already present.");
    }

    // 4. File Overwrite & Conflict Audit
    const filesToWrite = [];

    for (const file of manifest.files) {
      const relPath = file.target || file.path;
      const destPath = path.join(targetCwd, relPath);

      if (fs.existsSync(destPath)) {
        if (forceOverwrite) {
          filesToWrite.push({ file, destPath, relPath, overwrite: true });
        } else if (skipConfirm) {
          logger.warn(`Skipping existing file '${relPath}' (use --overwrite to replace).`);
        } else {
          const shouldOverwrite = await confirm(
            `File already exists: '${relPath}'. Overwrite?`,
            false
          );
          if (shouldOverwrite) {
            filesToWrite.push({ file, destPath, relPath, overwrite: true });
          } else {
            logger.info(`Skipped '${relPath}'.`);
          }
        }
      } else {
        filesToWrite.push({ file, destPath, relPath, overwrite: false });
      }
    }

    if (filesToWrite.length === 0) {
      logger.info("No files were written.");
      return 0;
    }

    // 5. Install Files
    if (isDryRun) {
      logger.info("[Dry Run] Would write the following files:");
      for (const item of filesToWrite) {
        console.log(`   • ${item.relPath} (${item.overwrite ? "overwrite" : "new"})`);
      }
      logger.success("[Dry Run] Completed without writing to disk.");
      return 0;
    }

    logger.step("Installing files...");
    for (const item of filesToWrite) {
      const dir = path.dirname(item.destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(item.destPath, item.file.content || "", "utf8");
      logger.success(`Installed ${logger.c("cyan", item.relPath)}`);
    }

    // 6. Final Instructions & Dependency Reminder
    logger.success(`Done! Added ${logger.c("bold", manifest.title)} to your project.`);

    if (depCheck.hasMissing && depCheck.installCommand) {
      console.log(`\n${logger.c("yellow", "Next step:")} Install missing dependencies:`);
      console.log(`  ${logger.c("green", depCheck.installCommand)}\n`);
    }

    return 0;
  } catch (err) {
    logger.error(err.message);
    return 1;
  }
}

module.exports = {
  addCommand,
};
