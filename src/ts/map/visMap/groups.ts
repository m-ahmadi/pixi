import conf from "core/config";

const ROOT = conf.ROOT;
const DIR = ROOT+"images/vis/";
const EXT = ".png";

/* device types
PC           = 1
ADSLModem    = 2
Printer      = 3
SwitchLayer2 = 4
SwitchLayer3 = 5
Router       = 6
*/
let groups = {
	type0: {
		shape: "image",
		image: DIR+ "0" +EXT
	},
	type1: {
		shape: "image",
		image: DIR+ "1" +EXT
	},
	type2: {
		shape: "image",
		image: DIR+ "2" +EXT
	},
	type3: {
		shape: "image",
		image: DIR+ "3" +EXT
	},
	type4: {
		shape: "image",
		image: DIR+ "4" +EXT
	},
	type5: {
		shape: "image",
		image: DIR+ "5" +EXT
	},
	type6: {
		shape: "image",
		image: DIR+ "6" +EXT
	}
};
	
export default groups;