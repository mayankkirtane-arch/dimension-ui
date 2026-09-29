#!/usr/bin/env node

/**
 * DimensionUI MCP Server Binary Entrypoint
 * Starts the MCP JSON-RPC 2.0 server over stdio.
 */

const { DimensionUiMcpServer } = require("../src/server");
const { RegistryConnector } = require("../src/registry-connector");

const registryUrl = process.env.DIMENSIONUI_REGISTRY_URL || "http://localhost:3000";
const connector = new RegistryConnector(registryUrl);
const server = new DimensionUiMcpServer(connector);

server.start();
