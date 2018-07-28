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
			yield x;
		}
	}
}

/**
* Solves M * v = b, where M is an upper-triangular matrix.
* My version of math.usolve, because usolve right now only supports
* square matrices. See https://github.com/josdejong/mathjs/issues/1168
* @param {Matrix} matrix - a (m,n) matrix
* @param {Matrix} b - target vector, represented as (m,1) matrix
* @return {Matrix} - a vector v, represented as (n,1) matrix,
* such that matrix * v = b, alternatively, returns undefined, if an error occurred
*/
function math_usolve(matrix, b) {
	let msize = matrix.size();
	let h = msize[0];
	let w = msize[1];
	let bsize = b.size();
	assert(bsize[0] <= h);
	assert(bsize[1] == 1);
	let re = undefined;
	if (w == h) {
		// M is a square matrix, use the standard function
		b.resize([h,1]);
		re = math.usolve(matrix,b);
	} else if (w > h) {
		matrix.resize([w,w]);
		b.resize([w,1]);
		re = math.usolve(matrix,b);
		matrix.resize([h,w]);
		b.resize([h,1]);
	} else if (w < h) {
		matrix.resize([h,h]);
		re = math.usolve(matrix,b);
		re.resize([w,1]);
		matrix.resize([h,w]);
		// or:
		// matrix.resize([w,w]);
		// // TODO: do some checks that last h-w elements of vector b are zeros
		// b.resize([w,1]);
		// re = math.usolve(matrix,b);
		// matrix.resize([h,w]);
	}
	return re;
}

function math_lsolve(matrix, b) {
	let msize = matrix.size();
	let h = msize[0];
	let w = msize[1];
	let bsize = b.size();
	assert(bsize[0] <= h);
	assert(bsize[1] == 1);
	let re = undefined;
	// L matrix is normaly square
	if (w == h) {
		// M is a square matrix, use the standard function
		b.resize([h,1]);
		re = math.usolve(matrix,b);
	}
	//  else if (w > h) {
	// 	matrix.resize([w,w]);
	// 	b.resize([w,1]);
	// 	re = math.usolve(matrix,b);
	// 	matrix.resize([h,w]);
	// 	b.resize([h,1]);
	// } else if (w < h) {
	// 	matrix.resize([h,h]);
	// 	re = math.usolve(matrix,b);
	// 	re.resize([w,1]);
	// 	matrix.resize([h,w]);
	// 	// or:
	// 	// matrix.resize([w,w]);
	// 	// // TODO: do some checks that last h-w elements of vector b are zeros
	// 	// b.resize([w,1]);
	// 	// re = math.usolve(matrix,b);
	// 	// matrix.resize([h,w]);
	// }
	return re;
}


function assert(a) {
	if (!a) throw "AssertionError";
}
