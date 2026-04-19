# EasyEDA AI Bridge

> 通过任意 AI Agent 远程控制嘉立创EDA专业版

**零配置 · 开箱即用 · 支持原理图 & PCB**

## ✨ 特性

- 🌐 **云端连接** — EDA 扩展主动连出，无需本地运行任何脚本
- 🔗 **配对码机制** — 一键获取配对码，AI Agent 即可连接
- 📐 **原理图 & PCB** — 完整支持读写原理图、PCB、网络表
- 🤖 **多 AI 支持** — Claude Code、Cursor、Cline、Gemini CLI 等
- 📊 **完整 API** — 读取器件、导线、网络、焊盘、走线等全部 EDA 数据
- 🔄 **自动重连** — 断线自动恢复，稳定可靠

## 架构

```
[你的电脑: 嘉立创EDA Pro + AI Bridge 扩展]
    ↓ 出站 WebSocket (自动穿过防火墙/NAT)
[wss://eda.sundaydx.com]  ← Cloudflare Tunnel
    ↓
[云端中继服务] ← 纯透传
    ↓ MCP stdio
[AI Agent (Claude Code / Cursor / ...)]
```

## 快速开始

### 1. 安装扩展

1. 下载最新的 `.eext` 文件 → [Releases](https://github.com/SundayDX/easyeda-ai-bridge/releases)
2. 嘉立创EDA Pro → **高级 → 扩展管理器** → 加载 `.eext` 文件
3. 重启 EDA，扩展自动激活并连接云端

### 2. 获取配对码

EDA 菜单栏 → **AI Bridge → 配对码**，弹出窗口显示：
- 配对码 (Token)
- EDA 连接地址
- MCP 连接地址

### 3. 配置 AI Agent

#### Claude Code

编辑 `~/.claude/mcp.json`：

```json
{
  "mcpServers": {
    "easyeda": {
      "command": "node",
      "args": [
        "/path/to/eda-cloud-mcp.js",
        "--token",
        "你的配对码"
      ],
      "env": {
        "EDA_RELAY_URL": "wss://eda.sundaydx.com"
      }
    }
  }
}
```

#### 其他 MCP 客户端

连接地址格式：
```
wss://eda.sundaydx.com/mcp/你的配对码
```

### 4. 使用

连接成功后，AI Agent 可以：

```javascript
// 读取原理图器件
eda.invoke({ path: "sch_PrimitiveComponent.getAll" })

// 读取 PCB 器件
eda.invoke({ path: "pcb_PrimitiveComponent.getAll" })

// 读取网络表
eda.invoke({ path: "sch_PrimitiveWire.getAll" })

// 搜索器件
eda.invoke({ path: "sch_PrimitiveComponent.getAll", args: [undefined, true] })

// 查看所有可用 API
eda.keys({ path: "eda" })
```

## 菜单说明

| 菜单 | 功能 |
|------|------|
| **连接状态** | 查看当前连接状态、服务器地址、错误信息 |
| **配对码** | 显示配对码和连接地址 |
| **连接** | 手动连接服务器 |
| **断开** | 手动断开连接 |
| **配置** | 修改 WebSocket 服务器地址 |

## 支持的 EDA API

### 原理图 (Schematic)
- `sch_PrimitiveComponent` — 器件操作
- `sch_PrimitiveWire` — 导线操作
- `sch_PrimitiveNet` — 网络操作
- `sch_PrimitiveText` — 文字标注
- `sch_Document` — 文档操作（保存、导出）
- `sch_SelectControl` — 选择控制

### PCB
- `pcb_PrimitiveComponent` — PCB 器件
- `pcb_PrimitivePad` — 焊盘
- `pcb_PrimitiveTrack` — 走线
- `pcb_PrimitiveVia` — 过孔
- `pcb_PrimitiveRegion` — 铜皮
- `pcb_PrimitiveDimension` — 尺寸标注
- `pcb_BoardOutline` — 板框

### 通用
- `dmt_Project` — 项目信息
- `dmt_Document` — 文档管理
- `sys_Environment` — 环境信息
- `sys_Storage` — 存储接口

## 自建服务

如果你想自建中继服务：

### 服务端

```bash
# 安装依赖
cd server && npm install

# 运行
node relay.js

# 或 systemd
cp eda-relay.service /etc/systemd/system/
systemctl enable --now eda-relay
```

### 生成配对码

```bash
curl https://your-server.com/token
```

### Cloudflare Tunnel 配置

```yaml
ingress:
  - hostname: eda.your-domain.com
    service: http://localhost:9100
```

## 致谢

- [jlc-eda-mcp](https://github.com/XuF163/jlc-eda-mcp) — 原始 EDA 扩展和 MCP 实现
- [easyeda-ai-bridge](https://github.com/FlowSwift-core/easyeda-ai-bridge) — 配对码远程连接概念

## License

Apache-2.0
