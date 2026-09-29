/**
 * Command: dimensionui info <name>
 * Displays detailed information about a registry template, block, or theme.
 */

const { RegistryClient } = require("../utils/registry-client");
const logger = require("../utils/logger");

async function infoCommand(name, options = {}) {
  if (!name || typeof name !== "string") {
    logger.error("Please specify a resource name. Example: npx dimensionui info aether-ai-saas");
    return 1;
  }

  const client = new RegistryClient(options.registry);

  try {
    const manifest = await client.getManifest(name);

    if (options.json) {
      console.log(JSON.stringify(manifest, null, 2));
      return 0;
    }

    const isFree = manifest.license.tier === "free";
    const priceColor = isFree ? "green" : "yellow";

    console.log(`\n${logger.c("bold", manifest.title)} ${logger.c("gray", `(${manifest.name})`)}`);
    console.log(`${logger.c("dim", manifest.description)}\n`);

    console.log(`${logger.c("cyan", "Specification:")}`);
    console.log(`  Type:         ${logger.c("magenta", manifest.type)}`);
    console.log(`  Version:      v${manifest.version}`);
    console.log(`  Framework:    ${manifest.framework === "next" ? "Next.js (App Router)" : "React"}`);
    console.log(`  Category:     ${manifest.metadata.category || "General"}`);
    console.log(`  Access:       ${manifest.access === "public" ? logger.c("green", "Public (Free)") : logger.c("yellow", "Commercial License Required")}`);
    console.log(`  Price:        ${logger.c(priceColor, manifest.license.price)}`);
    console.log(`  License:      ${manifest.license.type}`);

    // Figma status
    if (manifest.metadata.figma) {
      const figmaState = manifest.metadata.figma.state;
      console.log(`  Figma:        ${figmaState === "Figma Included" ? logger.c("green", "Included") : logger.c("gray", figmaState)}`);
    }

    // Dependencies
    const deps = Object.entries(manifest.dependencies || {});
    const devDeps = Object.entries(manifest.devDependencies || {});
    console.log(`\n${logger.c("cyan", "Dependencies:")}`);
    if (deps.length === 0 && devDeps.length === 0) {
      console.log(`  ${logger.c("gray", "No external dependencies required.")}`);
    } else {
      if (deps.length > 0) {
        console.log(`  Production: ${deps.map(([k, v]) => `${k}@${v}`).join(", ")}`);
      }
      if (devDeps.length > 0) {
        console.log(`  Dev:        ${devDeps.map(([k, v]) => `${k}@${v}`).join(", ")}`);
      }
    }

    // Files installed
    const files = manifest.files || [];
    console.log(`\n${logger.c("cyan", "Target Files:")}`);
    if (files.length === 0) {
      console.log(`  ${logger.c("gray", "No source files declared.")}`);
    } else {
      for (const file of files) {
        const dest = file.target || file.path;
        const lockStatus = file.locked ? logger.c("yellow", " [Locked - License Required]") : logger.c("green", " [Ready to install]");
        console.log(`  ${logger.c("magenta", "•")} ${dest}${lockStatus}`);
      }
    }

    // Integrations
    if (manifest.metadata.integrations && manifest.metadata.integrations.length > 0) {
      console.log(`\n${logger.c("cyan", "Integrations:")}`);
      for (const intg of manifest.metadata.integrations) {
        console.log(`  • ${intg.name} (${intg.status}) - ${logger.c("dim", intg.description)}`);
      }
    }

    // Action CTA
    console.log(`\n${logger.c("gray", "Install Command:")}`);
    console.log(`  ${logger.c("green", `npx dimensionui add ${manifest.name}`)}\n`);

    return 0;
  } catch (err) {
    logger.error(err.message);
    return 1;
  }
}

module.exports = {
  infoCommand,
};
