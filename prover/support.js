class Configuration {
  // store the construction (it is read from CindyJS) 
	constructor() {
		this.lines = new Map();
		this.points = new Map();
		this.incidences = new Set();
	}
  addPoint(p, pos) {
    if (this.points[p] == undefined) this.points[p] = {name: p, pos: pos, incidences: new Set()};
  }
  addLine(l) {
    if (this.lines[l] == undefined) this.lines[l] = {name: l, incidences: new Set()};
  }
  addIncidence(p,l) {
    this.points[p].incidences.add(l);
    this.lines[l].incidences.add(p);
    this.incidences.add(p+' '+l);
  }
  areIncident(p, l) {
    return (this.incidences.has(p+' '+l));
  }
  generateFrom(cindy) {
    let state = cindy.saveState();
		let geometry = state.geometry;
    function pos(p) {
      let info = cindy.evalcs(p.name+'.xy');
      let x = info.value[0].value.real;
      let y = info.value[1].value.real;
      return [x,y,1];
    }
    for (let elem of geometry) {
      switch (elem.type) {
        case 'Free':
          this.addPoint(elem.name, pos(elem));
          break;
        case 'Meet':
          this.addPoint(elem.name, pos(elem));
          this.addIncidence(elem.name, elem.args[0]);
          this.addIncidence(elem.name, elem.args[1]);
          break;
        case 'PointOnLine':
          this.addPoint(elem.name, pos(elem));
          this.addIncidence(elem.name, elem.args[0]);
          break;
        case 'Join':
          this.addLine(elem.name);
          this.addIncidence(elem.args[0], elem.name);
          this.addIncidence(elem.args[1], elem.name);
          break;
        // default:
      }
    }
  }
  det_sign(A,B,C) {
    let u = this.points[A].pos;
    let v = this.points[B].pos;
    let w = this.points[C].pos;
    let det = u[0]*v[1]*w[2] + u[1]*v[2]*w[0] + u[2]*v[0]*w[1]
            - u[0]*v[2]*w[1] - u[1]*v[0]*w[2] - u[2]*v[1]*w[0];
    let epsilon = 0.1**10; // anything below this we will consider zero
    if (math.abs(det) < epsilon) return 0;
    if (det < 0) return -1;
    return 1;
  }
}

class Triple {
  // class for a triple of points, used to store determinant terms
	constructor(A,B,C) {
		this.A = A;
		this.B = B;
		this.C = C;
	}
	toString() {
		return `${this.A},${this.B},${this.C}`;
	}
	static fromString(s) {
		let ABC = s.split(',');
		let re = new Triple();
		re.A = ABC[0];
		re.B = ABC[0];
		re.C = ABC[0];
		re.coef = 1;
		return re;
	}
	clone() {
		return new Triple(this.A,this.B,this.C);
	}
  sort() {
    function placeInOrder(triple, X, Y) {
  		if (triple[X] > triple[Y]) {
        let tmp = triple[X];
        triple[X] = triple[Y];
        triple[Y] = tmp;
  		}
  	}
    placeInOrder(this,'A','B');
  	placeInOrder(this,'B','C');
  	placeInOrder(this,'A','B');
    return this;
  }
	*[Symbol.iterator] () {
		yield this.A;
		yield this.B;
		yield this.C;
	}
}

function clean_log(text) {
	document.getElementById("log").innerHTML='';
}

function log(text, endline = '</br>') {
	document.getElementById("log").innerHTML+=text+endline;
}

function logConfiguration(c) {
	let re = '<table><tr><td></td>';
	for (let l of c.lines) {
		re += '<td>'+l+'</td>';
	}
	re += '</tr>';
	for (let d of c.points) {
		re += '<tr><td>'+d+'</td>';
		for (let l of c.lines) {
			if (c.areIncident(d,l)) {
				re += '<td>X</td>';
			} else {
				re += '<td></td>';
			}
		}
		re += '</tr>';
	}
	re += '</table>';
	log(re);
}

function pictureMatrix(m, id) {
	//TODO: make Y-axis go down maybe?
  //TODO: make the plot not lose its interactivity if another one is added.
	log(`<span id = ${id}></span>`);
	let data = [{
    z: m.toArray(),
    type: 'heatmap'
  }];
	Plotly.newPlot(id, data);
}

class Map {
	*[Symbol.iterator] () {
		for (let x of Object.keys(this)) yield x;
	}
}

class Set {
	constructor(iterable) {
		this.data = {};
		if (iterable!=undefined) {
			for (let x of iterable) {
				this.data[x] = true;
			}
		}
	}
	add(elem) {
		this.data[elem] = true;
	}
	remove(elem) {
		this.data[elem] = false;
	}
	contains(elem) {
		return (this.data[elem])?true:false;
	}
	// same as contains
	has(elem) {
		return (this.data[elem])?true:false;
	}
	toArray() {
		return Object.keys(this.data);
	}
	*[Symbol.iterator] () {
		for (let x of Object.keys(this.data)) {
      if (this.data[x]) {
			  yield x;
      }
		}
	}
  clone() {
    return new Set(this);
  }
}

function assert(a) {
	if (!a) throw "AssertionError";
}
