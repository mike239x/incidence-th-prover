/**
* Brakets manager, stores indices for brackets and vice versa. Indexation starts at 1.
* @method getIndex - given an index returns corresponding bracket
* @method getBracket - given the bracket returns corresponding index
*/
let BracketsManager = {
  brackets : [undefined],
  indices : {},
  getIndex : function (bracket) {
		let b = bracket.unsigned();
		let re = this.indices[b];
		if (re == undefined) {
			re = this.brackets.length;
			// register new bracket:
			this.brackets.push(b);
			this.indices[b] = re;
		}
		return re;
	},
  getBracket : function (i) {
		return this.brackets[i];
	}
};

/**
* class for the geometric configuration. keeps all the dots, lines, and incidies between those
* @property {Array of Objects} dotes - all the dots
* @property {Array of Objects} lines - all the lines
* @property {Set of Strings} incidences - all the incidences in form `${dot},${line}`
* TODO write down the methods
*/
class Configuration {
	constructor() {
		this.lines = [];
		this.points = [];
		this.incidences = new Set([]);
	}
	/**
	* TODO description
	*/
	generateBiQpoly() {
		let re = [];
		for (let l of this.lines) {
			let d = undefined;
			for (let d_ of this.points) {
				if (!this.areIncident(d_.name, l.name)) {
					d = d_;
					break;
				}
			}
			if (d == undefined) {
				// well it seems all the points lie on the current line, so we can't do anything
				continue;
			}
			let D = d.name;
			// ok, we got point D fixed
			let ABCs = neededTriples(l.incidences);
			// and we got a list of triples for points A,B,C
			for (let e of this.points) {
				// we go through all the other points, those that are not D and not on the line l:
				let E = e.name;
				if (E != D && !this.areIncident(E, l.name)) {
					for (let ABC of ABCs) {
						re.push(vector(...ABC, D, E));
					}
				}
			}
		}
		return re;
	}
	add(obj) {
		let o = {
			name : obj.name,
			incidences : []
		};
		switch (obj.type) {
			case 'Free':
			case 'Meet':
				this.points.push(o);
				break;
			case 'Join':
				this.lines.push(o);
		}
		switch (obj.type) {
			case 'Meet':
				for (let line of obj.args) {
					this.addIncidence(obj.name, line);
				}
				break;
			case 'Join':
				for (let dot of obj.args) {
					this.addIncidence(dot, obj.name);
				}
		}
	}
	addIncidence(dot, line) {
		for (let d of this.points) {
			if (d.name == dot) {
				d.incidences.push(line);
			}
		}
		for (let l of this.lines) {
			if (l.name == line) {
				l.incidences.push(dot);
			}
		}
		this.incidences.add(`${dot},${line}`);
	}
	areIncident(dot, line) {
		return (this.incidences.has(`${dot},${line}`));
	}
	HTML() {
		let re = '<table><tr><td></td>';
		for (let l of this.lines) {
			re += `<td>${l.name}</td>`;
		}
		re += '</tr>';
		for (let d of this.points) {
			re += `<tr><td>${d.name}</td>`;
			for (let l of this.lines) {
				if (this.areIncident(d.name,l.name)) {
					re += '<td>X</td>';
				} else {
					re += '<td></td>';
				}
			}
			re += '</tr>';
		}
		re += '</table>';
		return re;
	}
}


/**
* Takes points ABCDE, where ABC lie on the same line and D&E do not lie on that line,
* and creates a vector log[ABD] + log[BCE] - log[ABE] - log[BCE]
* to index the brackets we use BracketsManager
* @param {String} A - points names
* @param {String} B
* @param {String} C
* @param {String} D
* @param {String} E
* @return {Array of Objects} a representation of a sparse vector object
*/
function vector(A,B,C,D,E) {
	let brackets = [new Bracket(A,B,D), new Bracket(B,C,E), new Bracket(A,B,E), new Bracket(B,C,D)];
	let indices = [];
	let c = 1;
	for (let b of brackets) {
		indices.push(BracketsManager.getIndex(b));
		c *= b.sign;
	}
	let re = [];
	if (c == -1) {
		re.push({
			index : 0,
			coef : 1
		});
	}
	for (let x = 0; x < 4; x++) {
		re.push({
			index : indices[x],
			coef : (x<2) ? 1 : -1
		});
	}
	return re;
}

/**
* Takes a line, and returns a list of triples to use for the BiQ-polynomials generation
* @param {Array of Strings} line - list of dots to chose from
* @return {Array of Triples} - those triples that we should process
*/
function neededTriples(line) {
	let re = [];
	let l = line.length;
	if (l < 3) return re; // if there are less then 3 points - do nothing
	for (let i = 1; i < l-1; i++) {
		re.push(new Triple(line[l-1],line[0],line[i]));
		for(let k = i+1; k < l; k++) {
			re.push(new Triple(line[i-1],line[i],line[k]));
		}
	}
	// see https://math.stackexchange.com/questions/2849155/paths-of-length-2-in-a-graph-whats-the-minimal-spanning-subset
	// M' = { v[i-1],v[i] - v[i],v[k] | 0 < i < k < n+1 } \ { 0 }
	return re;
}


/**
* Describes a triple of dots
* @property {String} A - first dot
* @property {String} B - second dot
* @property {String} C - third dot
* @method clone - creates a copy
* @method toString - string representation of a triple
* @method fromSting - generates a trilple from its text representation
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

	*[Symbol.iterator] () {
		yield this.A;
		yield this.B;
		yield this.C;
	}

}

/**
* Describes a bracket (symbolic determinant) of three dots
* @property {String} A - first dot
* @property {String} B - second dot
* @property {String} C - third dot
* @property {Number} sign - sign (+1 or -1)
* TODO write the rest of the documentation, add methods
*/

class Bracket extends Triple {
	constructor(A,B,C,sign = 1) {
		super(A,B,C);
		this.sign = sign;
		this.placeInOrder('A','B');
		this.placeInOrder('B','C');
		this.placeInOrder('A','B');
	}
	placeInOrder(A,B) {
		if (this[A] > this[B]) {
			this.swap(A,B);
		}
	}
	swap(A,B) {
		this.sign *= -1;
		let tmp = this[A];
		this[A] = this[B];
		this[B] = tmp;
	}
	unsigned() {
		return new Bracket(this.A,this.B,this.C, 1);
	}
	clone() {
		return new Bracket(this.A,this.B,this.C,this.sign);
	}
}
