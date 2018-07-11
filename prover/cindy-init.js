let cindy = createCindy({
	scripts: "cs*",
	defaultAppearance: { fontFamily: "sans-serif", lineSize: 1, pointSize: 5.0, textsize: 12.0 },
	angleUnit: "°",
	geometry: [
		// that is a pappos theorem, A, I & D lie on the same line even though the construction doesn't say that
		{ name: "A", type: "Free", pos: [ -5, 6, 1 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "B", type: "Free", pos: [ 6, 5, 1 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "C", type: "Free", pos: [ -5, -5, 1 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "D", type: "Free", pos: [ 5, -7, 1 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "a", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "A", "B" ], labeled: true },
		{ name: "b", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "C", "D" ], labeled: true },
		{ name: "E", type: "Free", pos: [ 2, 0, 1 ], color: [ 1.0, 0.0, 0.0 ], labeled: true },
		{ name: "c", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "B", "E" ], labeled: true },
		{ name: "d", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "D", "E" ], labeled: true },
		{ name: "F", type: "Meet", color: [ 1.0, 1.0, 0.0 ], args: [ "b", "c" ], labeled: true },
		{ name: "G", type: "Meet", color: [ 1.0, 1.0, 0.0 ], args: [ "a", "d" ], labeled: true },
		{ name: "e", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "G", "C" ], labeled: true },
		{ name: "f", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "F", "A" ], labeled: true },
		{ name: "H", type: "Meet", color: [ 1.0, 1.0, 0.0 ], args: [ "f", "e" ], labeled: true },
		{ name: "g", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "A", "D" ], labeled: true },
		{ name: "h", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "C", "B" ], labeled: true },
		{ name: "i", type: "Join", color: [ 0.0, 0.0, 1.0 ], args: [ "H", "E" ], labeled: true },
		{ name: "I", type: "Meet", color: [ 1.0, 1.0, 0.0 ], args: [ "i", "h" ], labeled: true }],
	ports: [
		{ id: "CSCanvas", width: 640, height: 448, background: "rgb(168,176,192)" } ]
});
