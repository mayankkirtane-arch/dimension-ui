# dimensionui CLI

Official command-line tool for [DimensionUI](https://dimensionui.com). Discover, inspect, and install verified UI templates, blocks, components, and design themes directly into your Next.js and React projects.

## Usage

```bash
# Add a template or block directly
npx dimensionui add aether-ai-saas

# List all available registry items
npx dimensionui list

# Inspect detailed technical specifications and dependencies
npx dimensionui info aether-ai-saas
```

## Commands

### `dimensionui list`
List resources from the DimensionUI registry with category, type, and price tags.
- `--type <template|block|component|theme>` Filter by resource type
- `--tier <free|paid>` Filter by pricing tier
- `--search <query>` Search by keywords or tags
- `--json` Output machine-readable JSON

### `dimensionui info <name>`
Show deep technical metadata for any registry resource, including framework compatibility, required dependencies, target file paths, and license information.

### `dimensionui add <name>`
Safely installs the specified resource into your current working project.
- Automatically checks your `package.json` for missing dependencies.
- Prevents silent file overwrites (prompts before destructive changes).
- Ensures commercial resources are gated by license authorization.
- `-y, --yes` Skip confirmation prompts.
- `--overwrite` Overwrite existing destination files.
- `--dry-run` Simulate installation without writing files.
- `--cwd <path>` Specify target project root directory.

## Security Model
- **Zero Secret Exposure**: Server credentials and service role keys are strictly excluded.
- **License Gating**: Paid resources are locked in the registry and cannot be downloaded without verified commercial license authorization.
- **Path Traversal Protection**: All manifest file paths are sanitized to prevent directory traversal outside the target workspace.
