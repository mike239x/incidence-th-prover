'use strict';

 math.config({
   number: 'Fraction'
 })

// TODO rename to proveCollinear or mb proveCollinearity
function prove_collinear(A,B,C) {
	try {
		// TODO: if cindy thinks ABC are not collinear tell that to the user

		log(`Proving that the points ${A}, ${B} and ${C} are collinear.`);
		log('Reading configuration:')
		let configuration = new Configuration();
		configuration.generateFrom(cindy);
		logConfiguration(configuration);

		let matrix = math.sparse([[]]);
		// // first goes the 2 * log(-1)
		matrix.set([0,0], 2);
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
		// let permutation = math.index(decomposition.p);
		let tested_vectors = math.sparse([[]])
		let result;
		let the_poly;
		i = 0;

		for (let poly of targetBQpoly(A,B,C, configuration)) {
			log(`trying to prove ${poly}`);
				let b = math.sparse([[]]);
				for (let c of poly.vector()) {
					// b.set([c.index,0], c.coef); // with no permutation
					b.set([decomposition.p[c.index],0], c.value); // with permutation
					tested_vectors.set([decomposition.p[c.index],i], c.value);
				}
				i++;
				// b =  b.subset(permutation);
				// console.log(b);
				let y;
				let x;
				try {
          y = math_lsolve(decomposition.L, b);
          x = math_usolve(decomposition.U, y);
          log('succeed!');
          result = x;
          //console.log(result);
          the_poly = poly;

          log(`tested vectors:`);
          pictureMatrix(tested_vectors, "pic4");
          log(`the following combination gives a good vector thing`);
          pictureMatrix(result, "pic5");
          log(`result times matrix is:`);
          pictureMatrix(math.multiply(decomposition.L, math.multiply(decomposition.U, result)), "pic6");

          break;
				} catch (e) {
            log(`failed`);
				}
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
		//
		// // TODO find a proper name for this function
		// function solve(polynomial) {
		//
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
