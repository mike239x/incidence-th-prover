function clean_log(text) {
	document.getElementById("log").innerHTML='';
}


function log(text, endline = '</br>') {
	document.getElementById("log").innerHTML+=text+endline;
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
	assert(bsize[0] == h);
	assert(bsize[1] == 1);
	let re = undefined;
	if (w == h) {
		// M is a square matrix, use the standard function
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

function assert(a) {
	if (!a) throw "AssertionError";
}
