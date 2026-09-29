/**
 * DimensionUI Model Context Protocol (MCP) Server.
 * Implements MCP JSON-RPC 2.0 over standard I/O.
 * Exposes safe read/discovery tools to AI coding assistants.
 */

const readline = require("readline");
const { RegistryConnector } = require("./registry-connector");

const PROTOCOL_VERSION = "2024-11-05";

const TOOLS_DEFINITIONS = [
  {
    name: "search_templates",
    description:
      "Search and discover DimensionUI templates using natural language keywords, category, pricing tier, Figma availability, or integration support. Example query: 'dark SaaS template with pricing and dashboard'.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Natural language search keywords (e.g., 'dark SaaS pricing dashboard', 'fitness trainer booking', '3D particle hero').",
        },
        category: {
          type: "string",
          description: "Optional category filter: 'SaaS & AI', 'Local Business', 'Portfolio', 'Fitness & Health', 'Real Estate', etc.",
        },
        tier: {
          type: "string",
          enum: ["free", "15", "20"],
          description: "Optional pricing tier filter: 'free' ($0), '15' ($15), or '20' ($20).",
        },
        hasFigma: {
          type: "boolean",
          description: "Optional filter for templates with verified included Figma design source files.",
        },
        hasIntegration: {
          type: "string",
          description: "Optional filter for third-party integrations: 'PayPal', 'Supabase', 'GitHub', 'Resend', etc.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of results to return (default 5).",
          default: 5,
        },
      },
    },
  },
  {
    name: "get_template",
    description:
      "Retrieve the complete verified specification and registry manifest for a specific DimensionUI template by ID or slug.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The template identifier (e.g., 'aether-ai-saas', 'nova-minimal-portfolio', 'cloudscale-analytics').",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "search_blocks",
    description:
      "Search for modular UI blocks, interactive 3D components, and motion sections in the DimensionUI vault (e.g. hero sections, pricing tables, booking flows, bento grids, review carousels).",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword search for block or component name (e.g. 'hero', 'bento', 'calculator', 'pricing', 'testimonial').",
        },
        market: {
          type: "string",
          enum: ["saas", "local-business", "b2b-agency", "ecommerce"],
          description: "Optional target market playbook filter.",
        },
        tier: {
          type: "string",
          enum: ["3D", "Motion", "Static"],
          description: "Optional visual tier filter: '3D', 'Motion', or 'Static'.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of blocks to return (default 10).",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_compatibility",
    description:
      "Check technical framework and cloud deployment platform compatibility matrix for DimensionUI templates (Next.js, React, Tailwind CSS, TypeScript, Vercel, Netlify, Cloudflare).",
    inputSchema: {
      type: "object",
      properties: {
        templateId: {
          type: "string",
          description: "Optional template ID to retrieve specific compatibility. If omitted, returns global baseline matrix.",
        },
      },
    },
  },
  {
    name: "get_installation_info",
    description:
      "Get the exact CLI installation command, required dependencies, and target file destinations to add a template or block into a project.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The template or block slug (e.g., 'aether-ai-saas', 'orbital-hero').",
        },
        packageManager: {
          type: "string",
          enum: ["npm", "pnpm", "yarn", "bun"],
          description: "Package manager to format installation commands for (default 'npm').",
          default: "npm",
        },
      },
      required: ["name"],
    },
  },
];

class DimensionUiMcpServer {
  constructor(connector = new RegistryConnector()) {
    this.connector = connector;
  }

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", async (line) => {
      if (!line.trim()) return;

      try {
        const request = JSON.parse(line);
        const response = await this.handleMessage(request);
        if (response) {
          process.stdout.write(JSON.stringify(response) + "\n");
        }
      } catch (err) {
        const errorResponse = {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32700,
            message: "Parse error: invalid JSON received.",
            data: err.message,
          },
        };
        process.stdout.write(JSON.stringify(errorResponse) + "\n");
      }
    });

    process.stderr.write("DimensionUI MCP Server running on stdio.\n");
  }

  async handleMessage(request) {
    const { id, method, params } = request;

    if (!method) {
      return {
        jsonrpc: "2.0",
        id: id || null,
        error: { code: -32600, message: "Invalid Request: method is missing." },
      };
    }

    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: "dimensionui-mcp",
              version: "1.0.0",
            },
          },
        };

      case "notifications/initialized":
        // Client acknowledgment notification
        return null;

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: TOOLS_DEFINITIONS,
          },
        };

      case "tools/call":
        return this.executeToolCall(id, params);

      default:
        return {
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method '${method}' not found.`,
          },
        };
    }
  }

  async executeToolCall(id, params) {
    if (!params || !params.name) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32602,
          message: "Invalid params: 'name' is required for tools/call.",
        },
      };
    }

    const toolName = params.name;
    const args = params.arguments || {};

    try {
      let data;
      switch (toolName) {
        case "search_templates":
          data = await this.connector.searchTemplates(args);
          break;

        case "get_template":
          data = await this.connector.getTemplate(args.name);
          break;

        case "search_blocks":
          data = await this.connector.searchBlocks(args);
          break;

        case "get_compatibility":
          data = await this.connector.getCompatibility(args.templateId);
          break;

        case "get_installation_info":
          data = await this.connector.getInstallationInfo(args.name, args.packageManager);
          break;

        default:
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Unknown tool '${toolName}'.`,
            },
          };
      }

      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        },
      };
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error executing tool '${toolName}': ${err.message}`,
            },
          ],
        },
      };
    }
  }
}

module.exports = {
  DimensionUiMcpServer,
  TOOLS_DEFINITIONS,
};
