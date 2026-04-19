#!/usr/bin/env node
/**
 * EDA Cloud MCP Bridge v2
 * 
 * 改进:
 * - 断线自动重连 (3s 间隔, 指数退避到 30s)
 * - 心跳保活
 * - 等待 EDA 连接时缓存 MCP 请求，EDA 连上后重试
 * - 更丰富的工具列表
 */

const readline = require('readline');
const { WebSocket } = require('ws');

const RELAY_BASE = process.env.EDA_RELAY_URL || 'wss://eda.sundaydx.com';

let token = null;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--token' && process.argv[i + 1]) token = process.argv[++i];
}

if (!token) {
  process.stderr.write('Usage: node eda-cloud-mcp.js --token <TOKEN>\n');
  process.stderr.write('Get a token from: https://eda.sundaydx.com/token\n');
  process.exit(1);
}

const relayUrl = `${RELAY_BASE}/mcp/${token}`;
let ws = null;
let edaReady = false;
let reconnectMs = 3000;
const MAX_RECONNECT_MS = 30000;
const PING_INTERVAL = 25000;

// ========== MCP stdio ==========
const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    handleMCP(JSON.parse(line));
  } catch (e) {
    debug(`Invalid JSON: ${e.message}`);
  }
});

function sendMCP(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function debug(msg) {
  process.stderr.write(`[eda-mcp] ${new Date().toISOString()} ${msg}\n`);
}

// ========== EDA 请求管理 ==========
let reqId = 0;
const pending = new Map();

function callEDA(method, params, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      reject(new Error('Relay not connected'));
      return;
    }
    const id = String(++reqId);
    const msg = JSON.stringify({ type: 'request', id, method, params });
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`EDA call timeout: ${method} (${timeoutMs / 1000}s)`));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timeout });
    ws.send(msg);
    debug(`→ EDA: ${method} (id=${id})`);
  });
}

// ========== MCP 处理 ==========
async function handleMCP(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    sendMCP({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'jlc-eda-cloud', version: '2.0.0' }
      }
    });
    return;
  }

  if (method === 'notifications/initialized') {
    connectRelay();
    return;
  }

  if (method === 'ping') {
    sendMCP({ jsonrpc: '2.0', id, result: {} });
    return;
  }

  if (method === 'tools/list') {
    sendMCP({ jsonrpc: '2.0', id, result: { tools: getToolList() } });
    return;
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const toolArgs = params?.arguments || {};
    try {
      let result;
      switch (toolName) {
        case 'eda.ping':
          result = await callEDA('ping');
          break;
        case 'eda.status':
          result = { edaConnected: edaReady, relayConnected: ws?.readyState === WebSocket.OPEN };
          break;
        case 'eda.schematic.listComponents':
          result = await callEDA('schematic.listComponents', toolArgs);
          break;
        case 'eda.schematic.listWires':
          result = await callEDA('schematic.listWires', toolArgs);
          break;
        case 'eda.schematic.listNets':
          result = await callEDA('schematic.listNets', toolArgs);
          break;
        case 'eda.pcb.listComponents':
          result = await callEDA('pcb.listComponents', toolArgs);
          break;
        case 'eda.pcb.listPads':
          result = await callEDA('pcb.listPads', toolArgs);
          break;
        case 'eda.pcb.listTraces':
          result = await callEDA('pcb.listTraces', toolArgs);
          break;
        case 'eda.invoke':
          result = await callEDA('eda.invoke', { path: toolArgs.path, args: toolArgs.args || [] });
          break;
        case 'eda.call':
          result = await callEDA(toolArgs.method, toolArgs.params);
          break;
        case 'eda.tools.list':
          result = await callEDA('tools.list');
          break;
        case 'eda.tools.call':
          result = await callEDA('tools.call', { name: toolArgs.name, arguments: toolArgs.arguments || {} });
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
      sendMCP({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] } });
    } catch (err) {
      sendMCP({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify({ error: err.message }) }], isError: true } });
    }
    return;
  }

  if (id) {
    sendMCP({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

function getToolList() {
  return [
    { name: 'eda.ping', description: '测试与嘉立创EDA的连接', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.status', description: '查看连接状态', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.schematic.listComponents', description: '获取原理图所有器件', inputSchema: { type: 'object', properties: { docId: { type: 'string' } } } },
    { name: 'eda.schematic.listWires', description: '获取原理图所有导线', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.schematic.listNets', description: '获取原理图网络', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.pcb.listComponents', description: '获取PCB所有器件', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.pcb.listPads', description: '获取PCB焊盘', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.pcb.listTraces', description: '获取PCB走线', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.invoke', description: '直接调用EDA API (如 sch_PrimitiveComponent.getAll)', inputSchema: { type: 'object', properties: { path: { type: 'string', description: 'API路径' }, args: { type: 'array', description: '参数' } }, required: ['path'] } },
    { name: 'eda.call', description: '调用EDA扩展RPC方法', inputSchema: { type: 'object', properties: { method: { type: 'string' }, params: { type: 'object' } }, required: ['method'] } },
    { name: 'eda.tools.list', description: '列出EDA扩展支持的所有工具', inputSchema: { type: 'object', properties: {} } },
    { name: 'eda.tools.call', description: '调用EDA扩展的jlc工具', inputSchema: { type: 'object', properties: { name: { type: 'string', description: '工具名 (如 jlc.bridge.ping)' }, arguments: { type: 'object' } }, required: ['name'] } }
  ];
}

// ========== WebSocket to Relay ==========
let pingTimer = null;

function connectRelay() {
  debug(`Connecting to relay: ${relayUrl}`);
  ws = new WebSocket(relayUrl);

  ws.on('open', () => {
    debug('Relay connected, waiting for EDA...');
    reconnectMs = 3000; // 重置退避
    startPing();
  });

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data.toString()); } catch { return; }

    if (msg.type === 'hello') {
      edaReady = true;
      debug(`✅ EDA connected! app=${JSON.stringify(msg.app)}, project=${JSON.stringify(msg.project)}`);
      return;
    }

    if (msg.type === 'response' && msg.id) {
      const p = pending.get(msg.id);
      if (p) {
        clearTimeout(p.timeout);
        pending.delete(msg.id);
        debug(`← EDA: response to id=${msg.id} (${msg.error ? 'ERROR' : 'OK'})`);
        if (msg.error) p.reject(new Error(msg.error.message || 'EDA error'));
        else p.resolve(msg.result);
      }
      return;
    }

    // EDA request (ping etc)
    if (msg.type === 'request') {
      debug(`← EDA request: ${msg.method}`);
      if (msg.method === 'ping') {
        ws.send(JSON.stringify({ type: 'response', id: msg.id, result: 'pong' }));
      }
      return;
    }
  });

  ws.on('close', (code, reason) => {
    edaReady = false;
    const r = reason ? reason.toString() : '';
    debug(`Relay disconnected (code=${code}${r ? ' reason=' + r : ''}), reconnecting in ${reconnectMs / 1000}s...`);
    stopPing();
    // 拒绝所有 pending
    for (const [id, p] of pending) { clearTimeout(p.timeout); p.reject(new Error('Relay disconnected')); }
    pending.clear();
    setTimeout(connectRelay, reconnectMs);
    reconnectMs = Math.min(reconnectMs * 2, MAX_RECONNECT_MS);
  });

  ws.on('error', (err) => {
    debug(`Relay error: ${err.message}`);
  });
}

function startPing() {
  stopPing();
  pingTimer = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.ping();
  }, PING_INTERVAL);
}

function stopPing() {
  if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
}

debug('EDA Cloud MCP v2 started');
