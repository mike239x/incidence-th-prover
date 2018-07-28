'use strict';

// TODO rename to proveCollinear or mb proveCollinearity
function prove_collinear(A,B,C) {
	try {
		log(`Proving that the points ${A}, ${B} and ${C} are collinear.`);
		log('Reading configuration:')
		let configuration = new Configuration();
		configuration.generateFrom(cindy);
		logConfiguration(configuration);
		let matrix = math.sparse([[]]);
		// // first goes the 2 * log(-1)
		// matrix.set([0,0], 2);
		// next go through all the polynomials (already represented as vectors) and
		// add them to the matrix
		let i = 0;
		for (let poly of givenBQpoly(configuration)) {
			for (let c of poly.vector()) {
				matrix.set([c.index,i+1], c.value);
			}
			i++;
		}
		log('Generated a matrix representing all those polynomials.');
		pictureMatrix(matrix, "pic1");

		let decomposition = math.lup(matrix);
		log('Decomposed that matrix using LUP decomposition.');
		log('L part of the decomposition:');
		pictureMatrix(decomposition.L, "pic2");
		log('U part of the decomposition:');
		pictureMatrix(decomposition.U, "pic3");

		for (let poly of targetBQpoly(A,B,C, configuration)) {
			log(`trying to prove ${poly}`);
		}
		// log(`Generated ${polynomials.length} BiQ polynomials, using ${BracketsManager.brackets.length-1} symbolic determinants.`);

		// // we want to make a sparse matrix with all those vectors, but sadly enough
		// // in math.js the only solid option to do so is to create zero-matrix and
		// // fill it with the elements
		// // (direct creation from the hand-made CCS matrix is not supported, see:
	  // // https://github.com/josdejong/mathjs/issues/1166)
		//
		// // create a sparse matrix of the proper size and fill it with the elements
		// // we will not resize the matrix just because
		// // set function resizes it on its own, leading to somewhat better performance
		// // matrix.resize([BracketsManager.brackets.length,polynomials.length+1]);
		//
		// // let permutation = math.index(decomposition.p);
		//
		// // TODO find a proper name for this function
		// function solve(polynomial) {
		//
		// 	let b = math.sparse([[]]);
		// 	for (let c of polynomial) {
		// 		// b.set([c.index,0], c.coef); // with no permutation
		// 		b.set([decomposition.p[c.index],0], c.coef); // with permutation
		// 	}
		// 	// console.log(b);
		// 	// b =  b.subset(permutation);
		// 	// console.log(b);
		// 	try {
		// 		let y = math.lsolve(decomposition.L, b);
		// 		return math_usolve(decomposition.U, y);
		// 	} catch (e) {
		// 		//TODO remove conlose logging, add proper logging mb
		// 		log('error occurred: '+e);
		// 		console.log(e);
		// 		return undefined;
		// 	} finally {
		// 	}
		// }
		//
		// //TODO
		// // now we want to construct a BiQ polynomial P such that
		// // P = 1 would mean A,B,C are collinear
		// // for this we need to select D, E
		// // and select the order of A.B and C
		//
		// // let targetVector = BQpoly(A,B,C,D,E);
		//
		// // console.log(solve(BQpoly('A','I','D','B','H')));
		//
	} catch (e) {
		log('error occurred: '+e);
		console.log(e);
	} finally {
	}
}
