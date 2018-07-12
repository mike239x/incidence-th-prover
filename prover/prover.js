function clean_log(text) {
	document.getElementById("log").innerHTML='';
}


function log(text, endline = '</br>') {
	document.getElementById("log").innerHTML+=text+endline;
}

function prove_collinear(A,B,C) {
	try {
		log(`proving that the points ${A}, ${B} and ${C} are collinear`);
		let state = cindy.saveState();
		let configuration = state.geometry;
		log('read configuration:')
		for (let elem of configuration) {
			if (elem.type == 'Free') {
				log(`${elem.name} = Free point`)
			} else {
				log(`${elem.name} = ${elem.type}(${elem.args})`)
			}
		}
	} catch (e) {
		log(e.message);
	} finally {
	}
}

class something {
	index(A,B,C) {

	}
}
