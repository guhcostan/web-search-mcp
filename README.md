## Web Search MCP

Minimal MCP server that can search the web and extract readable page content, similar to Cursor's built-in web context.

### Features

- **search_web**: Query the web (DuckDuckGo HTML) and return result URLs and titles
- **fetch_page**: Fetch any URL and extract readable content using Mozilla Readability + JSDOM

### Requirements

- Node.js 20+ (recommended: 20.18.1+)

### Install

```bash
npm install
```

### Run (stdio)

```bash
npm start
```

### Install globally

```bash
npm i -g @guhcostan/web-search-mcp
```

Then reference the binary `web-search-mcp`.

### Integrate with Cursor (MCP)

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "web-search-mcp": { "command": "web-search-mcp" }
  }
}
```

Alternatively, without global install, use npx:

```json
{
  "mcpServers": {
    "web-search-mcp": {
      "command": "npx",
      "args": ["-y", "@guhcostan/web-search-mcp@latest"]
    }
  }
}
```

### Tools

- **search_web**
  - input:
    - `query` (string, required)
    - `limit` (number, optional, 1–10, default 5)
  - output: array of `{ url: string; title?: string; snippet?: string }`

- **fetch_page**
  - input:
    - `url` (string URL, required)
  - output: `{ url: string; title?: string; content: string }`

### Development

Type-check, lint and tests:

```bash
npm run check
```

Run individually:

```bash
npm run build
npm run lint
npm test
```

### Notes

- Web search uses DuckDuckGo HTML; results may vary and are HTML-scraped (no API key required)
- Be mindful of target site terms of use and robots policies when fetching pages

### License

MIT

