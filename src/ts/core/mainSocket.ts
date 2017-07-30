import conf from "core/config";
import uk from "core/uk";

const inst = u.extend( newPubSub() );
const URL = conf.WS + "socket/open";
const note = uk.note;

let ws: any = {};
let opened = false;

function isOpen() {
	return opened;
}
function init() {
	let processNote: any;
	
	processNote = note.process("Opening WebSocket connection...");
	ws = new WebSocket(URL);
	
	ws.onopen = function (e: JQueryEventObject) {
		processNote.close();
		note.success("WebSocket opened.");
		console.log("Connection open...", e);
		opened = true;
		
		inst.emit("open");
	};
	ws.onmessage = function (e: any) {
		if ( u.isStr(e.data) ) {
			// console.log("String message received", e.data);
			
			inst.emit( "message", JSON.parse(e.data) );
		} else {
			// console.log("Other message received", e.data);
		}
	};
	ws.onerror = function (e: any) {
		processNote.close();
		note.error("WebSocket could not be opened.");
		console.log("WebSocket Error: " , e);
	};
	ws.onclose = function (e: any) {
		opened = false;
		console.log("Connection closed", e);
	};

}

inst.isOpen = isOpen;
inst.init = init;

declare var window: any;
window.mainSocket = inst;

export default inst