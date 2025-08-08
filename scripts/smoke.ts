import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'

async function run(): Promise<void> {
  const serverCmd = 'npm'
  const serverArgs = ['start']

  const transport = new StdioClientTransport({
    command: serverCmd,
    args: serverArgs,
    env: process.env,
    cwd: process.cwd()
  })

  const client = new Client({ name: 'smoke-client', version: '1.0.0' })
  await client.connect(transport)

  console.log('connected')

  const searchRes = await client.callTool({
    name: 'search_web',
    arguments: { query: 'site:example.com', limit: 2 }
  })
  console.log('search_web:', searchRes)

  const url = 'https://example.com'
  const fetchRes = await client.callTool({ name: 'fetch_page', arguments: { url } })
  console.log('fetch_page:', fetchRes)

  await client.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

