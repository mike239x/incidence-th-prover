cindy = createCindy({
	scripts: "cs*",
	defaultAppearance: { fontFamily: "sans-serif", lineSize: 1, pointSize: 5.0, textsize: 12.0 },
	angleUnit: "°",
	geometry: [
		{ name: "A", type: "Free", pos: [ 4.0, 0.26666666666666666, 0.4444444444444444 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "B", type: "Free", pos: [ 4.0, -1.0737463126843658, 0.2949852507374631 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "C", type: "Free", pos: [ 4.0, -2.41958041958042, 0.3496503496503497 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "D", type: "Free", pos: [ 4.0, 1.950877192982456, 0.3508771929824561 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "E", type: "Free", pos: [ 4.0, -1.6738197424892702, 0.21459227467811157 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "a", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "D", "E" ], labeled: true },
		{ name: "b", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "B", "C" ], labeled: true },
		{ name: "F", type: "Meet", color: [ 1.0, 0.0, 0.0 ], args: [ "a", "b" ], labeled: true },
		{ name: "Text0", type: "Text", pos: [ 4.0, -1.3445378151260505, -0.8403361344537815 ], color: [ 0.0, 0.0, 0.0 ], pinned: true, button: true, script: "B.xy = (A+C)/2;", text: "clickme" } ],
	ports: [
		{ id: "CSCanvas", width: 1301, height: 591, transform: [ { visibleRect: [ -9.06, 9.34, 42.98, -14.3 ] } ], background: "rgb(168,176,192)" } ],
	cinderella: { build: 1835, version: [ 2, 9, 1835 ] } });

// TODO this doesn't work
// cindy.evokeCS("B = (A+C)/2;");
