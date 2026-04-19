export const HEADER_MENUS = {
	home: [
		{
			id: 'ai_bridge_home',
			title: 'AI Bridge',
			menuItems: [
				{ id: 'ab_status_home', title: '连接状态', registerFn: 'mcpStatus' },
				{ id: 'ab_pair_home', title: '配对码', registerFn: 'mcpPairCode' },
				{ id: 'ab_connect_home', title: '连接', registerFn: 'mcpConnect' },
				{ id: 'ab_disconnect_home', title: '断开', registerFn: 'mcpDisconnect' },
				{ id: 'ab_configure_home', title: '配置', registerFn: 'mcpConfigure' },
			],
		},
	],
	sch: [
		{
			id: 'ai_bridge_sch',
			title: 'AI Bridge',
			menuItems: [
				{ id: 'ab_status_sch', title: '连接状态', registerFn: 'mcpStatus' },
				{ id: 'ab_pair_sch', title: '配对码', registerFn: 'mcpPairCode' },
				{ id: 'ab_connect_sch', title: '连接', registerFn: 'mcpConnect' },
				{ id: 'ab_disconnect_sch', title: '断开', registerFn: 'mcpDisconnect' },
				{ id: 'ab_configure_sch', title: '配置', registerFn: 'mcpConfigure' },
			],
		},
	],
	pcb: [
		{
			id: 'ai_bridge_pcb',
			title: 'AI Bridge',
			menuItems: [
				{ id: 'ab_status_pcb', title: '连接状态', registerFn: 'mcpStatus' },
				{ id: 'ab_pair_pcb', title: '配对码', registerFn: 'mcpPairCode' },
				{ id: 'ab_connect_pcb', title: '连接', registerFn: 'mcpConnect' },
				{ id: 'ab_disconnect_pcb', title: '断开', registerFn: 'mcpDisconnect' },
				{ id: 'ab_configure_pcb', title: '配置', registerFn: 'mcpConfigure' },
			],
		},
	],
} as const;
