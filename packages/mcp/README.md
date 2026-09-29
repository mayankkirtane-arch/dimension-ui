# @dimensionui/mcp-server

Official Model Context Protocol (MCP) server for DimensionUI. Exposes safe read and discovery tools allowing AI coding assistants (Claude Desktop, Cursor, Antigravity IDE) to discover, inspect, and recommend DimensionUI templates and modular blocks.

## Available MCP Tools

1. **`search_templates`**: Natural language search across templates by keywords, market, tier, Figma status, or integrations (e.g. *"Find a dark SaaS template with pricing and dashboard"*).
2. **`get_template`**: Retrieve the full verified specification and registry manifest for a specific template.
3. **`search_blocks`**: Find modular UI blocks and interactive 3D components (e.g. heroes, pricing tables, bento grids).
4. **`get_compatibility`**: Check framework and cloud platform deployment compatibility.
5. **`get_installation_info`**: Get exact CLI command (`npx dimensionui add <name>`) and required dependencies.

## Setup in Claude Desktop / Cursor / Antigravity

Add to your `claude_desktop_config.json` or `mcp_config.json`:

```json
{
  "mcpServers": {
    "dimensionui": {
      "command": "node",
      "args": ["./packages/mcp/bin/dimensionui-mcp.js"],
      "env": {
        "DIMENSIONUI_REGISTRY_URL": "http://localhost:3000"
      }
    }
  }
}
```

## Security Model
- **Read-Only / Discovery**: Operates exclusively in read mode; no write or delete operations.
- **Zero Secret Exposure**: Server credentials, tokens, and database secrets are never exposed.
- **Sandboxed Registry Ingestion**: Manifests are consumed strictly from the validated DimensionUI registry.
