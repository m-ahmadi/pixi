import root from "./root";

const PROT_1 = "http://";
const PROT_2 = "ws://";
const HOST_1 = "127.0.0.1";
const HOST_2 = "192.168.10.13";
const PORT = 3000;

const config = {
	ROOT:    root,
	WRKR:    root + "js/workers/",
	JX:      PROT_1 + HOST_1 +":"+ PORT + "/",
	WS:      PROT_2 + HOST_1 +":"+ PORT + "/",
	
	JX_ALT:  PROT_1 + HOST_2 +":"+ PORT + "/",
	WS_ALT:  PROT_2 + HOST_2 +":"+ PORT + "/",
};

export default config