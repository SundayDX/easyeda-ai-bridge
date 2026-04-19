import { loadBridgeConfig, saveBridgeConfig } from './bridge/config';
import { HEADER_MENUS } from './bridge/headerMenus';
import { showInfo, showToast, inputText } from './bridge/ui';
import { BridgeClient } from './bridge/wsClient';
import { handleRpc } from './handlers';

const RELAY_BASE = 'wss://eda.sundaydx.com';

const bridge = new BridgeClient();
let autoStarted = false;

function ensureAutoConnectStarted(): void {
	if (autoStarted) return;
	autoStarted = true;

	bridge.startAutoConnect({
		onInfo: (msg) => showToast(msg, msg.startsWith('Connected to') ? 'success' : 'error', 4),
		onRequest: async (method, params) => {
			return await handleRpc(method, params, { getStatus: () => bridge.getStatusSnapshot() });
		},
	});
}

function connectNow(): void {
	bridge.connect({
		onInfo: (msg) => showToast(msg, msg.startsWith('Connected to') ? 'success' : 'info', 4),
		onRequest: async (method, params) => {
			return await handleRpc(method, params, { getStatus: () => bridge.getStatusSnapshot() });
		},
	});
}

function extractToken(url: string): string | undefined {
	const match = url.match(/\/eda\/([a-f0-9]{32})$/);
	return match ? match[1] : undefined;
}

export function activate(): void {
	ensureAutoConnectStarted();

	try {
		void eda.sys_HeaderMenu.replaceHeaderMenus(HEADER_MENUS as any).catch(() => {});
	} catch {}

	try {
		const editorVersion = eda.sys_Environment.getEditorCurrentVersion();
		showToast(`AI Bridge 已加载 (EDA ${editorVersion})`, 'info', 3);
	} catch {
		showToast('AI Bridge 已加载', 'info', 3);
	}
}

export function deactivate(): void {
	try { eda.sys_HeaderMenu.removeHeaderMenus(); } catch {}
	bridge.dispose();
}

export function mcpConnect(): void {
	ensureAutoConnectStarted();
	connectNow();
}

export function mcpDisconnect(): void {
	bridge.disconnect({ onInfo: (msg) => showToast(msg, 'info', 3) });
}

export function mcpStatus(): void {
	ensureAutoConnectStarted();
	const s = bridge.getStatusSnapshot();

	const stateMap: Record<string, string> = {
		connected: '✅ 已连接',
		connecting: '🔄 连接中...',
		disconnected: '❌ 已断开',
	};
	const stateText = stateMap[s.connectionState] || s.connectionState;

	let info = `状态: ${stateText}\n`;
	info += `服务器: ${s.serverUrl}\n`;
	info += `传输: ${s.transport}\n`;

	if (s.lastConnectedAt) {
		info += `上次连接: ${new Date(s.lastConnectedAt).toLocaleString()}\n`;
	}
	if (s.lastError) {
		info += `错误: ${s.lastError}\n`;
	}

	const token = extractToken(s.serverUrl);
	if (token) {
		info += `\n配对码: ${token}`;
	}

	showInfo(info);
}

export function mcpPairCode(): void {
	ensureAutoConnectStarted();
	const cfg = loadBridgeConfig();
	const status = bridge.getStatusSnapshot();
	const url = status.serverUrl || cfg.serverUrl;
	const token = extractToken(url);

	if (!token) {
		showInfo(
			'当前为本地模式 (未配置云端连接)\n\n' +
			'请通过「配置」菜单设置远程地址，格式:\n' +
			'wss://eda.sundaydx.com/eda/<配对码>\n\n' +
			'配对码可从服务器的 /token 接口获取。'
		);
		return;
	}

	const stateMap: Record<string, string> = {
		connected: '✅ 已连接',
		connecting: '🔄 连接中...',
		disconnected: '❌ 已断开',
	};
	const stateText = stateMap[status.connectionState] || status.connectionState;

	showInfo(
		`配对码\n\n` +
		`Token: ${token}\n\n` +
		`EDA 连接地址:\n${url}\n\n` +
		`MCP 连接地址:\n${RELAY_BASE}/mcp/${token}\n\n` +
		`连接状态: ${stateText}\n\n` +
		`将此 Token 配置到 Claude Code 的 MCP 即可远程控制 EDA。`
	);
}

export function mcpDiagnostics(): void {
	ensureAutoConnectStarted();
	const status = bridge.getStatusSnapshot();
	const debugLog = bridge.getDebugLog();

	let editorVersion: string | undefined;
	try { editorVersion = eda.sys_Environment.getEditorCurrentVersion(); } catch {}

	showInfo(JSON.stringify({ ...status, eda: { editorVersion }, debugLog }, null, 2));
}

export async function mcpConfigure(): Promise<void> {
	ensureAutoConnectStarted();
	const cfg = loadBridgeConfig();

	const url = await inputText(
		'AI Bridge 配置',
		'WebSocket 服务器地址\n\n本地模式: ws://127.0.0.1:9050\n云端模式: wss://eda.sundaydx.com/eda/<配对码>',
		cfg.serverUrl,
		{ type: 'url', placeholder: 'wss://eda.sundaydx.com/eda/你的配对码' }
	);

	if (typeof url === 'string' && url.trim()) {
		cfg.serverUrl = url.trim();
		await saveBridgeConfig(cfg);
		showToast('已保存，正在重连...', 'success', 3);

		try { bridge.disconnect({ preserveLastError: true }); } catch {}
		connectNow();

		// 显示新配对码
		const token = extractToken(cfg.serverUrl);
		if (token) {
			setTimeout(() => {
				showToast(`配对码: ${token.slice(0, 8)}...`, 'info', 5);
			}, 1000);
		}
	}
}
