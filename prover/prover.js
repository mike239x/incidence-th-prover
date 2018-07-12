'use strict';

function prove_collinear(A,B,C) {
	try {
		log(`proving that the points ${A}, ${B} and ${C} are collinear`);
		let state = cindy.saveState();
		let configuration = state.geometry;
		log('read configuration:')
		let c = new Configuration();
		for (let elem of configuration) {
			c.add(elem);
		}
		log(c.to_HTML());
		let tm = new TriplesManager();
	} catch (e) {
		log(e.message);
	} finally {
	}
}

class Configuration {
	constructor() {
		this.lines = [];
		this.points = [];
	}
	add(obj) {
		let o = {
			name : obj.name,
			incidencies : []
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
					this.add_incidence(obj.name, line);
				}
				break;
			case 'Join':
				for (let dot of obj.args) {
					this.add_incidence(dot, obj.name);
				}
		}
	}
	add_incidence(dot, line) {
		for (let d of this.points) {
			if (d.name == dot) {
				d.incidencies.push(line);
			}
		}
		for (let l of this.lines) {
			if (l.name == line) {
				l.incidencies.push(dot);
			}
		}
	}
	to_HTML() {
		let re = '<table><tr><td></td>';
		for (let l of this.lines) {
			re += `<td>${l.name}</td>`;
		}
		re += '</tr>';
		for (let d of this.points) {
			re += `<tr><td>${d.name}</td>`;
			for (let l of this.lines) {
				if (d.incidencies.indexOf(l.name) != -1) {
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

class TriplesManager {
	constructor() {
		this.triples = [];
		this.indices = {};
	}
	getIndex(triple) {
		let re = this.indices[triple];
		if (re == undefined) {
			let t = triple.clone(true);
			re = this.triples.length;
			// register new triple:
			this.triples.push(t);
			this.indices[t] = re;
		}
		return re;
	}
	getTriple(i) {
		return this.triples[i];
	}
}

class Triple {
	constructor(A,B,C, coef = 1) {
		if (A == undefined) return;
		this.A = A;
		this.B = B;
		this.C = C;
		this.coef = coef;
		this.placeInOrder('A','B');
		this.placeInOrder('B','C');
		this.placeInOrder('A','B');
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
	clone(resetCoef = false) {
		let re = new Triple(this.A,this.B,this.C);
		if (resetCoef) {
			re.coef = 1;
		}
		return re;
	}
	placeInOrder(A,B) {
		if (this[A] > this[B]) {
			this.swap(A,B);
		}
	}
	swap(A,B) {
		this.coef *= -1;
		let tmp = this[A];
		this[A] = this[B];
		this[B] = tmp;
	}
}
