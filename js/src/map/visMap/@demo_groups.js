define(function () {
	const DIR = "images/vis/";
	const EXT = ".png";
	
/* '#33691e' // green
	'#00695c' // cyan
	'#ffd600' // yellow
	'#e65100' // orange
	'#ff1744' // pink
	'#b71c1c' // red

	'diamond'
	'dot'
	'star'
	'triangle'
	'triangleDown'
	'square'
*/
	
	let groups = {
		"1": {
			shape: "image",
			image: `${DIR}1${EXT}`
		},
		"2": {
			shape: "image",
			image: `${DIR}2${EXT}`
		},
		"3": {
			shape: "image",
			image: `${DIR}3${EXT}`
		},
		"4": {
			shape: "image",
			image: `${DIR}4${EXT}`
		},
		"5": {
			shape: "image",
			image: `${DIR}5${EXT}`
		},
		"6": {
			shape: "image",
			image: `${DIR}6${EXT}`
		},
		"7": {
			shape: "image",
			image: `${DIR}7${EXT}`
		},
		 "8": {
			shape: "image",
			image: `${DIR}8${EXT}`
		},
		"9": {
			shape: "image",
			image: `${DIR}9${EXT}`
		},
		"10": {
			shape: "image",
			image: `${DIR}10${EXT}`
		},
		"11": {
			shape: "diamond",
			color: "#33691e"
		},
		"12": {
			shape: "dot",
			color: "#00695c"
		},
		"13": {
			shape: "star",
			color: "#ffd600"
		},
		"14": {
			shape: "triangle",
			color: "#e65100"
		},
		"15": {
			shape: "triangleDown",
			color: "#ff1744"
		},
		"16": {
			shape: "square",
			color: "#b71c1c"
		},
		"17": {
			shape: "dot",
			color: "#00695c"
		},
		"18": {
			shape: "star",
			color: "#ffd600"
		},
		"19": {
			shape: "triangle",
			color: "#e65100"
		},
		"20": {
			shape: "triangleDown",
			color: "#ff1744"
		},
		"21": {
			shape: "square",
			color: "#b71c1c"
		},
		"22": {
			shape: "image",
			image: `${DIR}1${EXT}`
		}
		
		
		
		/* ,
		"17": {
			shape: "icon",
			icon: {
				face: "FontAwesome",
				code: "\uf0c0", // group
				size: 50,
				color: "#57169a"
			}
		},
		"18": {
			shape: "icon",
			icon: {
				face: "FontAwesome",
				code: "\uf007", // users
				size: 50,
				color: "#3f51b5"
			}
		} */
	};
	
	return groups;
});