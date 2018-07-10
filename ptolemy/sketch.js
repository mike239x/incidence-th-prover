createCindy({
  scripts: "cs*",
  defaultAppearance: {
    dimDependent: 0.7,
    fontFamily: "sans-serif",
    lineSize: 1,
    pointSize: 5.0,
    textsize: 12.0
  },
  angleUnit: "°",
  geometry: [
    {name: "F", type: "Free", pos: [4.0, 4.0, 4.0], color: [1.0, 0.0, 0.0], visible: false, labeled: true, textsize: 17.0},
    {name: "C0", type: "CircleByRadius", pos: {xx: -0.043478260869565216, yy: -0.043478260869565216, zz: 1.0, xy: 0.0, xz: 0.08695652173913043, yz: -0.08695652173913043}, color: [0.0, 0.0, 0.0], radius: 5.0, args: ["F"], size: 3},
    {name: "B", type: "PointOnCircle", pos: [{r: 3.3222973830867404, i: -2.7581621380314922E-17}, -4.0, {r: -1.0551630089759843, i: 4.839864843149169E-18}], color: [1.0, 1.0, 1.0], args: ["C0"], labeled: false, textsize: 17.0},
    {name: "", type: "OtherPointOnCircle", pos: [4.0, {r: -1.3913528272081075, i: 1.6670142252084705E-17}, {r: 0.7769086359081975, i: -1.765115184466657E-18}], color: [1.0, 1.0, 1.0], args: ["B"], pinned: true, size: 0.0},
    {name: "A", type: "PointOnCircle", pos: [4.0, {r: -1.5671921742694528, i: 1.4478092334759147E-17}, {r: 0.7962384657505979, i: -1.6493533468856314E-18}], color: [1.0, 1.0, 1.0], args: ["C0"], labeled: false, textsize: 17.0, printname: "A"},
    {name: "a", type: "Segment", color: [0.0, 0.0, 1.0], args: ["B", "A"], size: 3, overhang: 1.065},
    {name: "D", type: "PointOnCircle", pos: [{r: -1.4054588030280795, i: -9.085878664016988E-17}, -4.0, {r: 1.1497711636866899, i: 1.1034841346942333E-17}], color: [1.0, 1.0, 1.0], args: ["C0"], labeled: false, textsize: 17.0, printname: "D"},
    {name: "b", type: "Segment", color: [0.757, 0.0, 0.0], args: ["D", "B"], size: 3, overhang: 1.09},
    {name: "c", type: "Segment", color: [0.098, 0.62, 0.306], args: ["D", "A"], size: 3, overhang: 1.09},
    {name: "E", type: "PointOnCircle", pos: [4.0, {r: 2.9544858596193917, i: -1.3948967293482943E-16}, {r: -1.382461685663132, i: 2.4352151918808985E-17}], color: [1.0, 0.0, 0.0], args: ["C0"], visible: false, labeled: true, textsize: 17.0},
    {name: "C", type: "Free", pos: [4.0, 3.443037974683544, 0.6329113924050632], color: [1.0, 1.0, 1.0], labeled: false, textsize: 17.0},
    {name: "d", type: "Segment", color: [0.098, 0.62, 0.306], args: ["B", "C"], size: 3, overhang: 1.075},
    {name: "e", type: "Segment", color: [0.757, 0.0, 0.0], args: ["C", "A"], size: 3, overhang: 1.075},
    {name: "f", type: "Join", color: [0.0, 0.0, 1.0], args: ["D", "C"], size: 3, overhang: 1.075, clip: "inci"}
  ],
  ports: [{
    id: "CSCanvas",
    width: 685,
    height: 474,
    transform: [{visibleRect: [-12.46, 8.02, 14.94, -10.94]}],
    grid: 1.0,
    snap: true,
    background: "rgb(255,255,255)"
  }],
  use:["katex"],
  cinderella: {build: 1871, version: [2, 9, 1871]}
});
