/**
* Brakets manager, stores indices for brackets and vice versa. Indexation starts at 1.
* @method getIndex - given an index returns corresponding bracket
* @method getVariable - given the bracket returns corresponding index
*/
let VariablesManager = {
  variables : [],
  indices : {},
  getIndex : function (variable) {
		let re = this.indices[variable];
		if (re == undefined) {
      re = this.register(variable);
		}
		return re;
	},
  getVariable : function (i) {
		return this.variables[i];
	},
  register : function (variable) {
    let re = this.variables.length;
    this.variables.push(variable);
    this.indices[variable] = re;
    return re;
  }
};

VariablesManager.register(-1);

/**
* class for the geometric configuration. keeps all the dots, lines, and incidies between those
* @property {Array of Objects} dotes - all the dots
* @property {Array of Objects} lines - all the lines
* @property {Set of Strings} incidences - all the incidences in form `${dot},${line}`
* TODO write down the methods
*/

class Configuration {
	constructor() {
		this.lines = new Map();
		this.points = new Map();
		this.incidences = new Set();
	}
  addObject(obj) {
    switch (obj.type) {
      case 'Free':
        this.addPoint(obj.name);
        break;
      case 'Meet':
        this.addPoint(obj.name);
        this.addIncidence(obj.name, obj.args[0]);
        this.addIncidence(obj.name, obj.args[1]);
        break;
      case 'Join':
        this.addLine(obj.name);
        this.addIncidence(obj.args[0], obj.name);
        this.addIncidence(obj.args[1], obj.name);
        break;
      // default:
    }
  }
  addPoint(p) {
    if (this.points[p] == undefined) this.points[p] = {name: p, incidences: new Set()};
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
    for (let elem of geometry) {
      this.addObject(elem);
    }
  }
}


/**
* Describes a triple of dots
* @property {String} A - first dot
* @property {String} B - second dot
* @property {String} C - third dot
* @method clone - creates a copy
* @method toString - string representation of a triple
* @method fromSting - generates a trilple from its text representation
* @method symbolicDet - returns a sorted version of the triple with a proper sign
*/
class Triple {
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
  symbolicDet() {
    let re = {
      sign : 1,
      triple : this.clone()
    }
    function placeInOrder(A,B) {
  		if (re.triple[A] > re.triple[B]) {
        re.sign *= -1;
        let tmp = re.triple[A];
        re.triple[A] = re.triple[B];
        re.triple[B] = tmp;
  		}
  	}
    placeInOrder('A','B');
  	placeInOrder('B','C');
  	placeInOrder('A','B');
    return re;
  }
	*[Symbol.iterator] () {
		yield this.A;
		yield this.B;
		yield this.C;
	}
}

/**
* Takes the configuration and generates the BQ polynomials  (in vector form)
* that we can assume to be equal to 1 (equal to 0 in the vector form).
*/
function * givenBQpoly(config) {
  for (let l of config.lines) {
    let D = undefined;
    for (let d_ of config.points) {
      // TODO: change to checking if d is not on the line l 100%
      // cuz it can be on the line even though it is not clear from the configuration
      if (!config.areIncident(d_, l)) {
        D = d_;
        break;
      }
    }
    if (D == undefined) {
      // well it seems all the points lie on the current line, so we can't do anything
      continue;
    }
    // ok, we got point D fixed

    // Takes a line, and generates triples to use for the BiQ-polynomials generation
    function * neededTriples(...line) {
    	let l = line.length;
    	if (l < 3) return; // if there are less then 3 points - do nothing
    	for (let i = 1; i < l-1; i++) {
    		yield new Triple(line[l-1],line[0],line[i]);
    		for(let k = i+1; k < l; k++) {
    			yield new Triple(line[i-1],line[i],line[k]);
    		}
    	}
    	// see https://math.stackexchange.com/questions/2849155/paths-of-length-2-in-a-graph-whats-the-minimal-spanning-subset
    	// M' = { v[i-1],v[i] - v[i],v[k] | 0 < i < k < n+1 } \ { 0 }
    }
    let ABCs = neededTriples(...config.lines[l].incidences);
    // and we got a list of triples for points A,B,C
    for (let ABC of ABCs) {
      for (let E of config.points) {
      // we go through all the other points, those that are not D and not on the line l:
      // TODO: also change to checking if E is not on l 100%
        if (E != D && !config.areIncident(E, l)) {
          yield new BQpoly(...ABC, D, E);
        }
      }
    }
    // for (let e of config.points) {
    //   // we go through all the other points, those that are not D and not on the line l:
    //   let E = e.name;
    //   if (E != D && !config.areIncident(E, l.name)) {
    //     for (let ABC of ABCs) {
    //       yield BQpoly(...ABC, D, E);
    //     }
    //   }
    // }
  }
}

function * targetBQpoly(A,B,C, config) {
  // TODO: permute A, B & C
  for (let D of config.points) {
    // TODO: check if D lies on the line ABC
    if (D == A || D == B || D == C) continue;
    for (let E of config.points) {
      // TODO: check if E lies on the line ABC
      if (E == A || E == B || E == C || E == D) continue;
      // TODO: check if D,B,E lie on the same line
      yield new BQpoly(A,B,C,D,E)
    }
  }
}


/**
* TODO description
*/
// /**
// * Takes points ABCDE, where ABC lie on the same line and D&E do not lie on that line,
// * and creates a vector log[ABD] + log[BCE] - log[ABE] - log[BCE]
// * to index the brackets we use VariablesManager
// * @param {String} A - points names
// * @param {String} B
// * @param {String} C
// * @param {String} D
// * @param {String} E
// * @return {Array of Objects} a representation of a sparse vector object
// */

class BQpoly {
  constructor(A,B,C,D,E) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D;
    this.E = E;
  }
  toString() {
    return `[${this.A}${this.B}${this.D}][${this.B}${this.C}${this.E}] = [${this.A}${this.B}${this.E}][${this.B}${this.C}${this.E}]`;
  }
  vector() {
    let brackets = [
      new Triple(this.A,this.B,this.D).symbolicDet(),
      new Triple(this.A,this.B,this.E).symbolicDet(),
      new Triple(this.B,this.C,this.E).symbolicDet(),
      new Triple(this.B,this.C,this.D).symbolicDet()
    ];
    let re = [];
    let sign = 1;
    let coef = 1;
    for (let b of brackets) {
      re.push({
        index : VariablesManager.getIndex(b.triple),
        value : coef
      });
      coef *= -1;
      sign *= b.sign;
    }
    if (sign == -1) {
      re.push({
        index : VariablesManager.getIndex(-1),
        value : 1
      });
    }
    return re;
  }
}
