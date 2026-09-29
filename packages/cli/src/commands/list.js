/**
 * Command: dimensionui list
 * Lists available templates, blocks, components, and themes from the registry.
 */

const { RegistryClient } = require("../utils/registry-client");
const logger = require("../utils/logger");

async function listCommand(options = {}) {
  const client = new RegistryClient(options.registry);

  try {
    const data = await client.getIndex({
      type: options.type,
      tier: options.tier,
      search: options.search,
    });

    if (options.json) {
      console.log(JSON.stringify(data, null, 2));
      return 0;
    }

    const items = data.items || [];
    logger.banner();
    console.log(
      `${logger.c("cyan", "DimensionUI Registry Catalog")} (${items.length} resources available at ${client.baseUrl})\n`
    );

    if (items.length === 0) {
      logger.warn("No resources found matching the specified filters.");
      return 0;
    }

    const headers = ["NAME", "TYPE", "PRICE", "CATEGORY", "TITLE"];
    const rows = items.map((item) => {
      const priceBadge = item.tier === "free" ? logger.c("green", "FREE") : logger.c("yellow", item.price);
      const typeBadge = logger.c("magenta", item.type);
      return [item.name, typeBadge, priceBadge, item.category, item.title];
    });

    logger.table(headers, rows);

    console.log(`\n${logger.c("gray", "Tips:")}`);
    console.log(`  ${logger.c("cyan", "npx dimensionui info <name>")}  Inspect resource details, files & dependencies`);
    console.log(`  ${logger.c("cyan", "npx dimensionui add <name>")}   Install resource directly into your project\n`);

    return 0;
  } catch (err) {
    logger.error(err.message);
    return 1;
  }
}

module.exports = {
  listCommand,
};
