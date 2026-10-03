// سرور آموزشی «به شکل MCP» روی Streamable HTTP، نسخهٔ 2026-07-28:   node mcp.mjs  →  POST http://127.0.0.1:8822/mcp
// پیاده‌سازی کامل مشخصات نیست. فقط آن‌قدر هست که درس‌های همین فصل را در یک پروتکل تازه ببینیم:
//   هر درخواست مستقل است (نه session، نه handshake) · نام متد و ابزار در header تکرار می‌شود و باید با بدنه بخواند
//   فهرست ابزارها عمر تازگی دارد (ttlMs و cacheScope) · Origin بیگانه 403 می‌گیرد
import http from 'node:http'

const VERSION = '2026-07-28'
const ALLOWED_ORIGINS = ['http://127.0.0.1:8822', 'http://localhost:8822']
const grades = { sara: 18.5, ali: 16 }
const tools = [
  { name: 'get_grade', description: 'Return the grade of one student', inputSchema: { type: 'object', properties: { student: { type: 'string' } }, required: ['student'] } },
  { name: 'delete_grades', description: 'Delete all grades (destructive)', inputSchema: { type: 'object', properties: {} } },
]

http.createServer((req, res) => {
  const send = (status, body, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json', ...headers }); res.end(JSON.stringify(body) + '\n') }
  const rpcError = (status, id, code, message) => send(status, { jsonrpc: '2.0', id: id ?? null, error: { code, message } })

  if (req.url !== '/mcp') return send(404, { error: 'not found' })
  if (req.method !== 'POST') return send(405, { error: 'POST only' }, { Allow: 'POST' })
  if (req.headers.origin && !ALLOWED_ORIGINS.includes(req.headers.origin)) return send(403, { error: 'origin not allowed' })

  // آنچه یک gateway یا load balancer می‌بیند، بدون باز کردن بدنه:
  console.log(`header view:  Mcp-Method=${req.headers['mcp-method'] || '-'}  Mcp-Name=${req.headers['mcp-name'] || '-'}`)

  let raw = ''; req.setEncoding('utf8'); req.on('data', c => (raw += c)); req.on('end', () => {
    let msg; try { msg = JSON.parse(raw) } catch { return rpcError(400, null, -32700, 'Parse error') }
    const { id, method, params = {} } = msg
    if (req.headers['mcp-protocol-version'] !== VERSION) return rpcError(400, id, -32022, `Unsupported protocol version; this server speaks ${VERSION}`)
    if (req.headers['mcp-method'] !== method) return rpcError(400, id, -32020, 'Mcp-Method header does not match body')
    if (method === 'tools/call' && req.headers['mcp-name'] !== params.name) return rpcError(400, id, -32020, 'Mcp-Name header does not match body')
    console.log(`body view:    method=${method}${params.name ? `  name=${params.name}` : ''}`)

    const ok = result => send(200, { jsonrpc: '2.0', id, result: { resultType: 'complete', ...result } })
    if (method === 'server/discover') return ok({ protocolVersions: [VERSION], serverInfo: { name: 'ie-lab', version: '0.1.0' }, capabilities: { tools: {} } })
    if (method === 'tools/list') return ok({ tools, ttlMs: 300000, cacheScope: 'public' })
    if (method === 'tools/call') {
      if (params.name === 'get_grade') {
        const g = grades[params.arguments?.student]
        return ok({ content: [{ type: 'text', text: g === undefined ? 'no such student' : `${params.arguments.student}: ${g}` }], isError: g === undefined })
      }
      if (params.name === 'delete_grades') { for (const k of Object.keys(grades)) delete grades[k]; return ok({ content: [{ type: 'text', text: 'all grades deleted' }] }) }
      return rpcError(200, id, -32602, `Unknown tool: ${params.name}`)
    }
    return rpcError(200, id, -32601, 'Method not found')
  })
}).listen(8822, () => console.log('MCP-shaped teaching server:  POST http://127.0.0.1:8822/mcp'))
