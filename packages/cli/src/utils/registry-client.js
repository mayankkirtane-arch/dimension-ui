/**
 * Registry HTTP/HTTPS client for DimensionUI CLI.
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

const DEFAULT_REGISTRY_URL = process.env.DIMENSIONUI_REGISTRY_URL || "http://localhost:3000";

function requestJson(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(urlStr);
    } catch {
      return reject(new Error(`Invalid registry URL format: '${urlStr}'`));
    }

    const transport = parsed.protocol === "https:" ? https : http;
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "DimensionUI-CLI/1.0.0",
        ...(options.headers || {}),
      },
      timeout: options.timeout || 8000,
    };

    const req = transport.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          // Response was not JSON
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json || data,
          isJson: !!json,
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Registry request timed out after ${reqOptions.timeout}ms at ${urlStr}`));
    });

    req.on("error", (err) => {
      if (err.code === "ECONNREFUSED") {
        reject(
          new Error(
            `Could not connect to DimensionUI registry at '${urlStr}'.\nEnsure the DimensionUI server is running, or specify a custom registry using '--registry <url>' or DIMENSIONUI_REGISTRY_URL.`
          )
        );
      } else if (err.code === "ENOTFOUND") {
        reject(
          new Error(`Registry host '${parsed.hostname}' could not be resolved. Please check your network connection.`)
        );
      } else {
        reject(err);
      }
    });

    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

class RegistryClient {
  constructor(baseUrl = DEFAULT_REGISTRY_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async getIndex(queryParams = {}) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(queryParams)) {
      if (v !== undefined && v !== null && v !== "") {
        params.append(k, String(v));
      }
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const url = `${this.baseUrl}/api/registry${query}`;
    
    const res = await requestJson(url);
    if (res.statusCode !== 200) {
      const msg = res.data && res.data.message ? res.data.message : `HTTP ${res.statusCode}`;
      throw new Error(`Failed to fetch registry catalog index: ${msg}`);
    }
    return res.data;
  }

  async getManifest(name, options = {}) {
    const normalized = encodeURIComponent(name.toLowerCase().trim());
    const url = `${this.baseUrl}/api/registry/${normalized}`;

    const headers = {};
    if (options.authHeader) {
      headers["Authorization"] = options.authHeader;
    }

    const res = await requestJson(url, { headers });
    if (res.statusCode === 404) {
      throw new Error(
        `Resource '${name}' not found in registry at '${this.baseUrl}'.\nRun 'dimensionui list' to view all available templates and blocks.`
      );
    }
    if (res.statusCode !== 200) {
      const msg = res.data && res.data.message ? res.data.message : `HTTP ${res.statusCode}`;
      throw new Error(`Failed to retrieve registry manifest for '${name}': ${msg}`);
    }
    return res.data;
  }
}

module.exports = {
  RegistryClient,
  DEFAULT_REGISTRY_URL,
};
