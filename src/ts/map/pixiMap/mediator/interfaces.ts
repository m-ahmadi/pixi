interface TNode {
	id: number;
	name: string;
	x: number;
	y: number;
	links: number[] | boolean;
	type: number;
	management_ip: string;
	manufacturer: string;
	mode: string;
	open_ports: number[];
	serial: string;
	last_seen: number;
	last_update: number;
}
interface TLink {
	id: number;
	src: number;
	dest: number;
}
interface TNodes {
	[key: string]: Node;
}
interface TLinks {
	[key: string]: TLink;
}
interface T_MapData {
	type: string;
	append: boolean;
	nodes: TNodes;
	links: TLinks;
}