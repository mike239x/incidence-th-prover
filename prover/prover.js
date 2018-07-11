function prove_collinear(A,B,C) {
	try {
		let state = cindy.saveState();
		let configuration = state.geometry;
		console.log(configuration);
	} catch (e) {
		console.log(e.message);
	} finally {
	}
}
prove_collinear("A","I","D");
