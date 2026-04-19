#!/usr/bin/env node
/**
 * EDA WebSocket Relay Server v3
 * 
 * - 心跳保活 (relay 主动 ping EDA 每 10s)
 * - EDA 握手: 收到 hello 后发 ping request 确认握手
 * - 断线保护: 单侧断开不销毁会话
 * - Token 持久化
 */

const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '9100', 10);
const TOKEN_FILE = path.join(__dirname, 'tokens.json');
const STALE_TIMEOUT = 1800000; // 30min

function loadTokens() {
  try { return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8')); } catch { return {}; }
}

function saveTokens(tokens) {
  try { fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2)); } catch {}
}

const sessions = new Map();

function getSession(token) {
  if (!sessions.has(token)) {
    sessions.set(token, { eda: null, mcp: null, lastActivity: Date.now(), logs: [] });
  }
  return sessions.get(token);
}

function log(token, msg) {
  const sess = getSession(token);
  const t = token.slice(0, 8);
  console.log(`[${new Date().toISOString()}] [${t}] ${msg}`);
  sess.logs.push({ ts: Date.now(), msg });
  if (sess.logs.length > 200) sess.logs.splice(0, sess.logs.length - 200);
  sess.lastActivity = Date.now();
}

// ========== 双向透传 ==========
function pipe(edaWs, mcpWs, token) {
  edaWs.on('message', (data) => {
    const raw = typeof data === 'string' ? data : data.toString('utf8');
    log(token, 'pipe EDA→MCP: ' + raw.slice(0,200));
    if (mcpWs.readyState === WebSocket.OPEN) mcpWs.send(raw);
  });
  mcpWs.on('message', (data) => {
    const raw = typeof data === 'string' ? data : data.toString('utf8');
    log(token, 'pipe MCP→EDA: ' + raw.slice(0,200));
    if (edaWs.readyState === WebSocket.OPEN) edaWs.send(raw);
  });
}

// ========== 连接处理 ==========
function attachSession(ws, token, role) {
  const sess = getSession(token);
  const other = role === 'eda' ? 'mcp' : 'eda';

  if (sess[role]) {
    try { sess[role].close(1000, 'Replaced'); } catch {}
  }

  sess[role] = ws;
  log(token, `${role} connected (eda=${!!sess.eda}, mcp=${!!sess.mcp})`);

  // EDA 特殊处理：握手 + 心跳
  if (role === 'eda') {
    let helloReceived = false;
    const origMsg = ws._messageHandlers || [];
    
    ws.prependListener('message', (data) => {
      const raw = typeof data === 'string' ? data : data.toString();
      log(token, `EDA→relay: ${raw.slice(0, 200)}`);
    });

    // 监听 EDA 的 hello 消息
    ws.on('message', function handshakeHandler(data) {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'hello' && !helloReceived) {
          helloReceived = true;
          log(token, `EDA hello received (app=${JSON.stringify(msg.app)})`);
          // 发 ping request 完成握手
          ws.send(JSON.stringify({ type: 'request', id: 'relay-handshake', method: 'ping' }));
          log(token, 'Handshake ping sent');
        }
      } catch {}
    });

    // 5秒后如果没收到 hello，强制发 ping
    setTimeout(() => {
      if (!helloReceived) {
        log(token, 'Hello timeout, sending ping anyway');
        ws.send(JSON.stringify({ type: 'request', id: 'relay-force-ping', method: 'ping' }));
      }
    }, 5000);

    // 每 10 秒发 ping 保持连接（EDA 扩展 25s 无流量会认为断线）
    const keepAlive = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const msg = JSON.stringify({ type: 'request', id: `keepalive-${Date.now()}`, method: 'ping' });
        log(token, `relay→EDA: keepalive ping`);
        ws.send(msg);
      } else {
        clearInterval(keepAlive);
      }
    }, 10000);
    ws.on('close', () => clearInterval(keepAlive));
  }

  // WebSocket 层 ping/pong
  const pingTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.ping();
    else clearInterval(pingTimer);
  }, 30000);
  ws.on('close', () => clearInterval(pingTimer));

  // 如果另一侧也在，建立透传
  if (sess[other] && sess[other].readyState === WebSocket.OPEN) {
    log(token, '🔗 Both sides connected, relay active!');
    pipe(sess.eda, sess.mcp, token);
  }

  ws.on('close', (code, reason) => {
    log(token, `${role} disconnected (code=${code})`);
    if (sess[role] === ws) sess[role] = null;
  });

  ws.on('error', (err) => {
    log(token, `${role} error: ${err.message}`);
  });
}

// ========== HTTP + WS ==========
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const details = [...sessions.entries()].map(([t, s]) => ({
      token: t.slice(0, 8) + '...', eda: !!s.eda, mcp: !!s.mcp,
      lastActivity: new Date(s.lastActivity).toISOString(),
      recentLogs: s.logs.slice(-3).map(l => l.msg)
    }));
    res.end(JSON.stringify({ status: 'ok', sessions: details.length, details }, null, 2));
    return;
  }

  if (url.pathname === '/token') {
    const token = crypto.randomBytes(16).toString('hex');
    const persisted = loadTokens();
    persisted[token] = { createdAt: new Date().toISOString() };
    saveTokens(persisted);
    getSession(token);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      token,
      edaUrl: `wss://eda.sundaydx.com/eda/${token}`,
      mcpUrl: `wss://eda.sundaydx.com/mcp/${token}`,
    }, null, 2));
    return;
  }

  if (url.pathname === '/tokens') {
    const persisted = loadTokens();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Object.entries(persisted).map(([t, info]) => ({
      token: t.slice(0, 8) + '...', full: t, ...info,
      connected: (() => { const s = sessions.get(t); return s ? { eda: !!s.eda, mcp: !!s.mcp } : null; })()
    })), null, 2));
    return;
  }

  if (url.pathname === '/rpc' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      let rpc;
      try { rpc = JSON.parse(body); } catch { res.writeHead(400); res.end('Invalid JSON'); return; }
      // Find session with EDA connected
      let edaWs = null;
      for (const [t, s] of sessions) {
        if (s.eda && s.eda.readyState === WebSocket.OPEN) { edaWs = s.eda; break; }
      }
      if (!edaWs) { res.writeHead(503); res.end(JSON.stringify({error:'No EDA connected'})); return; }
      const id = 'rpc-' + Date.now();
      const msg = JSON.stringify({type:'request', id, method: rpc.method, params: rpc.params||{}});
      const timeout = setTimeout(() => { edaWs.removeListener('message', handler); res.writeHead(504); res.end(JSON.stringify({error:'timeout'})); }, 30000);
      function handler(data) {
        const raw = typeof data === 'string' ? data : data.toString('utf8');
        try {
          const m = JSON.parse(raw);
          if (m.id === id) {
            clearTimeout(timeout);
            edaWs.removeListener('message', handler);
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(m));
          }
        } catch {}
      }
      edaWs.on('message', handler);
      edaWs.send(msg);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = req.url || '';
  const edaMatch = url.match(/^\/eda\/([a-f0-9]{32})$/);
  if (edaMatch) { getSession(edaMatch[1]); attachSession(ws, edaMatch[1], 'eda'); return; }

  const mcpMatch = url.match(/^\/mcp\/([a-f0-9]{32})$/);
  if (mcpMatch) { getSession(mcpMatch[1]); attachSession(ws, mcpMatch[1], 'mcp'); return; }

  ws.close(4004, `Unknown path: ${url}`);
});

// 清理过期会话
setInterval(() => {
  const now = Date.now();
  for (const [token, sess] of sessions) {
    const alive = (sess.eda && sess.eda.readyState === WebSocket.OPEN) ||
                  (sess.mcp && sess.mcp.readyState === WebSocket.OPEN);
    if (!alive && now - sess.lastActivity > STALE_TIMEOUT) {
      log(token, 'Session expired');
      sessions.delete(token);
    }
  }
}, 60000);

server.listen(PORT, '127.0.0.1', () => {
  const persisted = loadTokens();
  for (const token of Object.keys(persisted)) getSession(token);
  console.log(`EDA Relay v3 listening on 127.0.0.1:${PORT}`);
  console.log(`  Tokens: ${Object.keys(persisted).length}`);
});
