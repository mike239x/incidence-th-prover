// use strict js typing
'use strict';

// main function, tries to prove that the given 3 points are collinear
function prove_collinear(A,B,C) {

  // exctracting configuration from CindyJS
  let configuration = new Configuration();
  configuration.generateFrom(cindy); // we expect to have a global instance of CindyJS
  //logConfiguration(configuration);
  // adds an incidence table of the configuration to the html body

  let VariablesManager = {
    // object to index everything
    // (mostly determinant terms)
    variables : [],
    indices : {},
    getIndex : function (variable) {
      let result = this.indices[variable];
      if (result == undefined) {
        result = this.register(variable);
      }
      return result;
    },
    getVariable : function (i) {
      return this.variables[i];
    },
    register : function (variable) {
      let result = this.variables.length;
      this.variables.push(variable);
      this.indices[variable] = result;
      return result;
    }
  };

  class Equation {
    constructor(M,N,O,X,Y) {
      this.M = M; this.N = N; this.O = O; this.X = X; this.Y = Y;
    }
    toString () {
      return `|${this.O}${this.M}${this.X}|⋅|${this.O}${this.N}${this.Y}| ／ |${this.O}${this.M}${this.Y}|⋅|${this.O}${this.N}${this.X}|`;
    }
    valid() { // check that all "-1"-s cancel out
      let sign = configuration.det_sign(this.O, this.M, this.X)
               * configuration.det_sign(this.O, this.N, this.Y)
               * configuration.det_sign(this.O, this.M, this.Y)
               * configuration.det_sign(this.O, this.N, this.X);
      return sign == 1;
    }
    signature () {
      return [ { triple : new Triple(this.O, this.M, this.X).sort(), coef : 1 },
               { triple : new Triple(this.O, this.N, this.Y).sort(), coef : 1 },
               { triple : new Triple(this.O, this.M, this.Y).sort(), coef : -1 },
               { triple : new Triple(this.O, this.N, this.X).sort(), coef : -1 } ];
    }
  }

  function possible_incidences(l) {
    // given a line `l` get points which might lie on this line
    // ask CindyJS which points might lie on the same line,
    // store the result in `tmp`
    cindy.evokeCS('javascript("tmp = \'"+incidences('+l+')+"\';")');
    return new Set(tmp.slice(1,-1).split(', '));
  }

  function * given() {
    // _generate_ given equations for the configurationuration
    for (let l of configuration.lines) {
      let points_on_the_line = possible_incidences(l);
      // select points not lying on the line `l`
      let points_not_on_the_line = new Set();
      let n = 0;
      for (let p of configuration.points) {
        if (! points_on_the_line.contains(p)) {
          points_not_on_the_line.add(p);
          n++;
        }
      }
      if (n < 2) {
        // we do not have enough points lying not on the current line
        continue;
      }
      let X = undefined;
      for (let x of points_not_on_the_line) { X = x; break; }
      // fastest way to access some random element of the set
      points_not_on_the_line.remove(X);
      function * required_triples(...line) {
        // takes array of points as an arguement 
        // and generates triples to use for the signatures generation
        // (the middle point -- normally called O -- being the point B)
        let len = line.length;
        if (len < 3) return; // if there are less then 3 points there are no triples
        for (let i = 1; i < len-1; i++) {
          yield new Triple(line[len-1],line[0],line[i]);
          for(let k = i+1; k < len; k++) {
            yield new Triple(line[i-1],line[i],line[k]);
          }
        }
        // see https://math.stackexchange.com/questions/2849155/paths-of-length-2-in-a-graph-whats-the-minimal-spanning-subset
        // M' = { v[i-1],v[i] - v[i],v[k] | 0 < i < k < n+1 } \ { 0 }
      }
      let ABCs = required_triples(...configuration.lines[l].incidences);
      // and we got a generator of triples for points A,B,C
      for (let ABC of ABCs) {
        for (let Y of points_not_on_the_line) {
          // we go through all the other points not on the line `l`,
          yield new Equation(ABC.A, ABC.C, ABC.B, X, Y);
        }
      }
    }
  }

  let M = math.sparse([[]]);
  M.set([0,0], 2);
  let equations_names = [];
  // next go through the equations that hold for the given configuration
  // and store their signatures in M; also store their string representations in `equations_names`
  let index = 0;
  for (let eq of given(configuration)) {
    for (let term of eq.signature()) {
      let det_index = VariablesManager.getIndex(term.triple.sort());
      M.set([det_index,index], term.coef);
    }
    equations_names[index] = eq.toString();
    index++;
  }

  let decomposition = math.lup(M);
  let L = decomposition.L;
  let U = decomposition.U;
  let p = decomposition.p;
  let [h,w] = M.size();
  // some black magic provided by math.js library to help us
  // solve sparse matrix equations
  // say we want to solve Mx=b
  // and let L, U, p be the results of math.lup(M)
  // then: p is a vector representing permutation of rows
  // if we permute both sides of Mx=b with p we will get
  // p(M)x=p(b) with p(M) = LU
  // L is a lower triangular matrix (sometimes lower trapezoid matrix)
  // with 1 on the main diagonal;
  // U is an upper triangular matrix in row echolon form (at least I think so)
  // this way we can always use math.lsolve and then math.usolve
  // to get x.

  // unfortunately math.usolve and math.lsolve have explicit assertions to check 
  // that input matrix is square, so we will have a work-around by changing the sizes
  // of L/U. For more info on this issue see 
  // https://github.com/josdejong/mathjs/issues/1168
  if (h < w) U.resize([w,w]);
  if (h > w) L.resize([h,h]);
  function generate(b) {
    // try to solve Mx=b
    try {
      if (h < w) {
        let y = math.lsolve(L, b);
        y.resize([w,1]);
        let x = math.usolve(U, y);
        return x;
      }
      if (h > w) {
        let y = math.lsolve(L, b);
        y.resize([w,1]);
        let x = math.usolve(U, y);
        return x;
      }
      let y = math.lsolve(L, b);
      let x = math.usolve(U, y);
      return x;
    } catch (e) {
      return undefined;
    }
  }

  function * target() {
    // _generate_ all valid equations which imply collinearity of A,B,C
    let ABC = [A,B,C];
    let other_points = [];
    for (let p of configuration.points) other_points.push(p);
    other_points.pop(other_points.indexOf(A));
    other_points.pop(other_points.indexOf(B));
    other_points.pop(other_points.indexOf(C));
    for (let i = 0; i < other_points.length; i++) {
      let X = other_points[i];
      for (let j = i+1; j < other_points.length; j++) {
        let Y = other_points[j];
        for (let k = 0; k < 3; k++) {
          // permute points ABC
          let eq = new Equation(ABC[k%3],ABC[(k+1)%3],ABC[(k+2)%3],X,Y);
          if (eq.valid()) yield eq;
        }
      }
    }
  }

  let proof_found = false;

  for (let eq of target()) {
    // go through equations that imply collinearity of ABC, try to generate those
    let valid = true;
    // flag indicating validity of the equation
    let b = math.sparse([[]]);
    // a sparse vector to store the signature of the equation `eq`
    for (let term of eq.signature()) {
      let det_index = VariablesManager.getIndex(term.triple.sort());
      if (det_index >= h) {
        valid = false;
        break;
      }
      det_index = p[det_index];
      b.set([det_index,0], term.coef);
    }
    if (!valid) continue;
    b.resize([h,1]);
    let combination = generate(b);
    if (combination == undefined) continue;
    // if we can't generate this equation we try next one
    proof_found = true;
    // we found a way to generate this equation; presenting proof to the user
    log(eq.toString());
    let first = true;
    for (let i = 0; i < w; i++) {
      let coef = combination.get([i,0]);
      if (coef != 0) {
        log((first ? ' = ' : ' × ') + '(' + equations_names[i] + ') ^ ' + coef);
        first = false;
      }
    }
    break;
  }

  if (!proof_found) {
    // if no proof found inform user about that
    log('Unable to prove it ¯\_(⊙︿⊙)_/¯')
  }

}
