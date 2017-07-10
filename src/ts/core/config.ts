define(() => {
	const t = {
		HTTP:   "http://",
		WS:     "ws://"
	};
	const h = {
		LOCAL:  "127.0.0.1",
		REMOTE: "192.168.10.13"
	};
	const p = {
		MAIN:   3000
	};
	
	return {
		ROOT:    "",
		JAX:     t.HTTP + h.LOCAL  + `:${p.MAIN}/`,
		WS:      t.WS   + h.LOCAL  + `:${p.MAIN}/`,
		JAX_ALT: t.HTTP + h.REMOTE + `:${p.MAIN}/`,
		WS_ALT:  t.WS   + h.REMOTE  + `:${p.MAIN}/`
	};
});