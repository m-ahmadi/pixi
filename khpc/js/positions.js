define(function () {
	var	diff = 66 - 10,
		a = {x: 910, y: 6},
		b = {x: -20, y: 628},
		c = {x: 647, y: 664},
		d = {x: 896, y: 559}; 
	
	return {
		"1": {
			x: a.x,
			y: a.y
		},
		"2": {
			x: a.x,
			y: a.y + diff
		},
		"3": {
			x: a.x,
			y: a.y + (diff*2)
		},
		"4": {
			x: b.x,
			y: b.y
		},
		"5": {
			x: b.x,
			y: b.y + diff
		},
		"6": {
			x: b.x,
			y: b.y + (diff*2)
		},
		"7": {
			x: c.x,
			y: c.y
		},
		"8": {
			x: c.x,
			y: c.y + diff
		},
		"9": {
			x: c.x,
			y: c.y + (diff*2)
		},
		"10": {
			x: d.x,
			y: d.y
		},
		"11": {
			x: d.x,
			y: d.y + diff
		}
	};
});

/*
s1: {
			nX: 914,
			nY: 10,
			vX: 994,
			vY: 10,
			name: DEFAULT_NAME,
			value: DEFAULT_VALUE
		},
		s2: {
			nX: 914,
			nY: 66,
			vX: 994,
			vY: 66,
			name: DEFAULT_NAME,
			value: DEFAULT_VALUE
		},
		s3: {
			nX: 914,
			nY: 122,
			vX: 994,
			vY: 122,
			name: DEFAULT_NAME,
			value: DEFAULT_VALUE
		},
		s4: {
			nX: 23,
			nY: 628,
			vX: 103,
			vY: 628,
			name: DEFAULT_NAME,
			value: DEFAULT_VALUE
		},
*/