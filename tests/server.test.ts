import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { fetchPageReadable, searchWebDuckDuckGo } from '../src/server.js';

describe('web-search-mcp tools', () => {
  const mockAgent = new MockAgent();

  beforeAll(async () => {
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);
  });

  afterAll(async () => {
    await mockAgent.close();
  });

  it('searchWebDuckDuckGo parses HTML results', async () => {
    const html = `
      <div id="links">
        <div class="result">
          <a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fa">
            Result A
          </a>
        </div>
        <div class="result">
          <a class="result__a" href="https://example.com/b">Result B</a>
        </div>
      </div>
    `;
    const duck = mockAgent.get('https://duckduckgo.com');
    duck
      .intercept({ path: /\/html.*/i, method: 'GET' })
      .reply(200, html, { headers: { 'Content-Type': 'text/html' } });

    const results = await searchWebDuckDuckGo('query', 5);
    expect(results.length).toBe(2);
    expect(results[0].url).toBe('https://example.com/a');
    expect(results[0].title).toBe('Result A');
  });

  it('fetchPageReadable extracts content using Readability', async () => {
    const html = `
      <html><head><title>Page T</title></head>
      <body>
        <article><h1>Headline</h1><p>Hello world content.</p></article>
      </body></html>
    `;
    const origin = mockAgent.get('https://example.org');
    origin.intercept({ path: '/page', method: 'GET' }).reply(200, html, {
      headers: { 'Content-Type': 'text/html' }
    });

    const page = await fetchPageReadable('https://example.org/page');
    expect(page.content).toContain('Hello world');
  });

  it('fetchPageReadable truncates large responses and handles timeouts', async () => {
    const big = 'x'.repeat(2_000_000);
    const origin = mockAgent.get('https://big.example');
    origin
      .intercept({ path: '/x', method: 'GET' })
      .reply(200, big, { headers: { 'Content-Type': 'text/html' } });
    const start = Date.now();
    const result = await fetchPageReadable('https://big.example/x', {
      maxBytes: 200_000,
      timeoutMs: 5000
    });
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content.length).toBeLessThanOrEqual(200_000);
    expect(Date.now() - start).toBeLessThan(6000);
  });
});

